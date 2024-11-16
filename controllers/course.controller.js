const httpStatus = require("http-status");
const courseService = require("../services/course.service");
const  ApiError  = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const quizService = require("../services/quiz.service");
const chapterService = require("../services/chapter.service");
const courseEnrollService = require("../services/courseEnroll.service");
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * create course
 */
const create = catchAsync(async (req, res) => {
    if (req.body.chapterIds!=null) {
      try {
        chapterIds = addChapters.map(id => new ObjectId(id));
      } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ObjectId passed");
      }
    }
    if (req.body.creator != req.user._id)
      throw new ApiError(httpStatus.BAD_GATEWAY, "creator field not same as the user name")
    let course = await courseService.create(req.body);
    let enrollment = await courseEnrollService.createEnrollmentForCourse(course._id, [])
    if (!enrollment) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Can not create enrollment object')
    }
    res.status(httpStatus.CREATED).send(course)
});


/**
 * update course
 */
const update = catchAsync(async (req, res) => {
  let {courseId, title, description, addTags, 
    removeTags, addChapters, removeChapters, isPublished, contentOrder} = req.body;
  let course = await courseService.getCourseByCourseId(courseId)
  if (!course) 
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  if (course.creator != req.user._id)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to update the course")

  title = title!=null ? title : course.title;
  description = description!=null ? description : course.description;
  addTags = addTags!=null ? addTags : [];
  removeTags = removeTags!=null ? removeTags : [];
  addChapters = addChapters!=null ? getObejectIdsFromIds(addChapters) : [];
  removeChapters = removeChapters!=null ? removeChapters : [];
  isPublished = isPublished!=null ? isPublished : course.isPublished

  contentOrder = contentOrder!=null ? contentOrder : [];

  updateCourseTags(course, addTags, removeTags);
  updateCourseChapterIds(course, addChapters, removeChapters);

  let combinedIds = [...course.chapterIds, ...course.quizIds];
  if (contentOrder.length!=0 && combinedIds.length != contentOrder.length)
      throw new ApiError(httpStatus.BAD_REQUEST, "Content order contains invalid IDs")

  combinedIds= combinedIds.map(id => id.toString());
  let isValidContentOrder = contentOrder.every(id => combinedIds.includes(id));
  if (!isValidContentOrder)
    throw new ApiError(httpStatus.BAD_REQUEST, "Content order contains invalid IDs");

  let response = await courseService.update(courseId, title, description, 
    course.tags, course.chapterIds, isPublished, contentOrder)
  res.status(httpStatus.OK).send(response);
});

/**
 * search course with/ without tag filter
 */
const search = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const keyword = req.query.keyword;
  const tags = req.query.tags ? req.query.tags.split(',').map(tag => tag.trim()) : [];
  const category = req.query.category;
  let response = await courseService.search(keyword, tags, category, skip, limit);
  const allTags = new Set();
  for (const course of response.courses) {
    for (const tag of course.tags) {
      allTags.add(tag)
    }
  }
  response.allTags = Array.from(allTags);
  response.currentPage = page;
  res.status(httpStatus.OK).send(response);
})

/**
 * search course by id
 */
const searchCourseById = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  console.log(courseId)
  let response = await courseService.getCourseByCourseId(courseId)
  console.log(response)
  if (!response)
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  res.status(httpStatus.OK).send(response)
})

const searchCourseByCreatorId = catchAsync(async (req, res) => {
  const { creatorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let response = await courseService.getCourseByCreatorId(creatorId, skip, limit)
  const allTags = new Set();
  for (const course of response.courses) {
    for (const tag of course.tags) {
      allTags.add(tag)
    }
  }
  response.allTags = Array.from(allTags);
  response.currentPage = page;

  if (!response)
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  res.status(httpStatus.OK).send(response)
})

let getObejectIdsFromIds = (ids) => {
  try {
    ids = ids.map(id => new ObjectId(id));
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ObjectId passed");
  }
  return ids;
}

const updateCourseChapterIds = (course, addChapters, removeChapters) => {
  addChapters = getObejectIdsFromIds(addChapters);
  removeChapters = getObejectIdsFromIds(removeChapters)
  course.chapterIds = course.chapterIds.filter(chapter => !removeChapters.includes(chapter))
  course.chapterIds.push(...addChapters)
}

const updateCourseTags = (course, addTags, removeTags) => {
  course.tags = course.tags.filter(item => !removeTags.includes(item))
  course.tags.push(...addTags)
}

const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  let response = await courseService.deleteCourseById(courseId);
  if (!response)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Course not found")
  const deleteQuiz = await quizService.deleteQuizByCourseId(courseId);
  if (!deleteQuiz)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can not delete quizes for this course")
  const deleteChapter = await chapterService.deleteChapterByCourseId(courseId);
  if (!deleteChapter)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can not delete chapters for this course")
  const deleteEnrollment = await courseEnrollService.deleteCourseEnrollment(courseId);
  if (!response)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Course not found")
  res.status(httpStatus.OK).send({'course':response, 'enrollments':deleteEnrollment.learnerIds});
})


const categoryAndTags = catchAsync(async (req, res) => {
  const courses = await courseService.getAllCourses();
  const categoryTagsMap = new Map();
  courses.forEach(course => {
    if (course.tags && course.tags.length > 0) {
      course.tags.forEach(tag => {
        if (!categoryTagsMap.has(course.category)) {
          categoryTagsMap.set(course.category, []);
        }
        categoryTagsMap.get(course.category).push(tag);
      });
    }
  });
  categoryTagsMap.forEach((tags, category) => {
    categoryTagsMap.set(category, [...new Set(tags)]);
  });
  response = Array.from(categoryTagsMap.entries()).reduce((acc, [category, tags]) => {
    if (category == null) {
      acc['others'] = tags;
    } else if (category !== undefined) {
      acc[category] = tags;
    }

    return acc;
  }, {});
  res.status(httpStatus.OK).send(response);
})

const getAllCourses = catchAsync(async (req, res) => {
  // ideally this should be paginated. something like search only right.
  // no this will also have answers
  // just search method without any query!
  const courses = await courseService.getAllCourses();
  res.status(httpStatus.OK).send(courses);
})

const getAllCourseIds = catchAsync(async (req, res) => {
  const courses = await courseService.getAllCourses();
  const courseIds = courses.map(course => course._id);
  res.status(httpStatus.OK).send({'courseIds': courseIds});
})

const setCourseCommission = catchAsync(async (req, res) => {
  const {courseId, creatorShare} = req.body;
  const existingCommission = await courseService.getCourseCommission(courseId);
  if (existingCommission) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Commission already exists for this course");
  }
  let course = await courseService.getCourseByCourseId(courseId)
  if (!course)
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  console.log(course._id, course.creator, creatorShare)
  const commission = await courseService.setCourseCommissions(course._id, course.creator, creatorShare);
  if (!commission)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "And not save course commission")
  res.status(httpStatus.OK).send(commission);
})

const deleteCourseCommission = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const existingCommission = await courseService.getCourseCommission(courseId);
  if (!existingCommission) {
    throw new ApiError(httpStatus.NOT_FOUND, "No commission found for this course");
  }
  await courseService.deleteCourseCommission(existingCommission._id);
  res.status(httpStatus.OK).send({ message: "Commission successfully deleted" });
})

const updateCourseCommission = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { creatorShare } = req.body;
  const existingCommission = await courseService.getCourseCommission(courseId);
  if (!existingCommission) {
    throw new ApiError(httpStatus.NOT_FOUND, "No commission found for this course");
  }
  existingCommission.creatorShare = creatorShare;
  const updatedCommission = await courseService.updateCourseCommission(existingCommission);
  if (!updatedCommission) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to update commission");
  }
  res.status(httpStatus.OK).send(updatedCommission);
})


const getCourseCommissions = catchAsync(async (req, res) => {
  const { creatorId, courseId } = req.query;
  // fix me
  // if ( creatorId && req.user._id !== creatorId && !req.user.roles.includes('admin')) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "User not authorized to view this commission");
  // }
  if (courseId) {
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course)
      throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  }

  const commissions = await courseService.getCourseCommissions(creatorId, courseId);
  if ( commissions.length==0 )
    throw new ApiError(httpStatus.BAD_REQUEST, "Commission does not exist");
  res.status(httpStatus.OK).send(commissions);
})

// const getCourseCommission = catchAsync(async (req, res) => {
//   const { courseId } = req.params;
//   const commission = await courseService.getCourseCommission(courseId);
//   return commission;
// })

// const getCommissionForCreator = catchAsync(async (req, res) => {
//   const { creatorId, courseId } = req.query;

//   if (req.user._id !== creatorId && !req.user.roles.includes('admin')) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "User not authorized to view this commission");
//   }
//   if (courseId) {
//     const course = await courseService.getCourseByCourseId(courseId);
//     if (!course)
//       throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
//   }
//   const commissions = await courseService.getCommissionForCreator(creatorId, courseId)
//   res.status(httpStatus.OK).send(commissions)
// })

module.exports = {
  create,
  update,
  search,
  deleteCourse,
  searchCourseById,
  searchCourseByCreatorId,
  categoryAndTags,
  getAllCourses,
  getAllCourseIds,
  setCourseCommission,
  getCourseCommissions,
  updateCourseCommission,
  deleteCourseCommission
  // getCommissionForCreator,
  // getCourseCommission
};