const httpStatus = require("http-status");
const courseService = require("../services/course.service");
const  ApiError  = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");


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
    res.status(httpStatus.CREATED).send(course)
});


/**
 * update course
 */
const update = catchAsync(async (req, res) => {
  let {courseId, title, description, addTags, 
    removeTags, addChapters, removeChapters, isPublished} = req.body;
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

  updateCourseTags(course, addTags, removeTags);
  updateCourseChapterIds(course, addChapters, removeChapters);

  let response = await courseService.update(courseId, title, description, course.tags, course.chapterIds, isPublished)
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
  let response = await courseService.search(keyword, tags, skip, limit);
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

/**
 * delete a course
 */
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
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  res.status(httpStatus.OK).send(response);
})


module.exports = {
  create,
  update,
  search,
  deleteCourse,
  searchCourseById
};