const httpStatus = require("http-status");
const {chapterService, courseService} = require("../services");
const  ApiError  = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");


/**
 * create course
 */
const create = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    let course = await getCourseByCourseId(courseId, req.user._id)
    let chapterIds = course.chapterIds
    if (await checkIfChapterNumberExists(chapterIds, req.body.chapterNumber))
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter number already exists")
    if (!(req.body.chapterNumber == chapterIds.length+1)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter number should be greater than the number of chapters in the course by 1")
    }
    req.body.courseId = courseId;
    req.body.creatorId = req.user._id;

    const chapter = await chapterService.create(req.body);

    // add to the course
    course.chapterIds.push(chapter._id)
    const udpateCourseRespose = await course.save()
    if (!udpateCourseRespose) {
      await chapterService.deleteChapterById(chapter._id)
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add chapter to the course")
    }

    const addChapterNumberResponse = await chapterService.addChapterNumber(chapter._id, req.body.chapterNumber)
    if (!addChapterNumberResponse) {
      await chapterService.deleteChapterById(chapter._id)
      course.chapterIds = course.chapterIds.filter(id => id != chapter._id)
      await course.save()
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add chapter number to the chapter")
    }

    res.status(httpStatus.CREATED).send({...chapter.toObject(),
        chapterName: req.body.chapterNumber,
  })
});

const checkIfChapterNumberExists = async (chapterIds, chapterNumber) => {
  for (let chapterId of chapterIds) {
    let chapterNum = await chapterService.getChapterNumberByChapterId(chapterId)
    if (chapterNum == chapterNumber)
      return true
  }
  return false 
}

const getCourseByCourseId = async (courseId, userId) => {
  let course = await courseService.getCourseByCourseId(courseId)
  if (!course) 
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  if (course.creator != userId)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to update the course")
  return course
}

const update = catchAsync(async (req, res) => {
    const {chapterId, courseId} = req.params;
    let {title, content, isPublished, isFree, chapterNumber} = req.body
    // todo add logic for chapterNumber update if enable rearragment of chapters
    let chapter = await chapterService.getChapterById(chapterId)
    if (!chapter)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")  

    title = title!=null ? title : chapter.title;
    content = content!=null ? content : chapter.content;
    isPublished = isPublished!=null ? isPublished : chapter.isPublished;
    isFree = isFree!=null ? isFree : chapter.isFree;

    if (!chapter)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")
    if (chapter.courseId != courseId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not part of the course")
    if (chapter.creatorId != req.user._id)
      throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to update the chapter")

    const udpateChapterResponse = await chapterService.update(chapterId, title, content, isPublished, isFree)
    if (!udpateChapterResponse)
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update the chapter")


    const chapterNum = await chapterService.getChapterNumberByChapterId(chapterId)
    res.status(httpStatus.OK).send({...udpateChapterResponse.toObject(),
      chapterName: chapterNum.chapterNumber,
  })
}); 

const getChaptersByCourseId = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const course = await courseService.getCourseByCourseId(courseId)
    let responseChapters = []
    if (!course)
      throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
    const chapters = await Promise.all(course.chapterIds.map(id => chapterService.getChapterById(id)))
    for (let chapter of chapters) {
      const chapterNumber = await chapterService.getChapterNumberByChapterId(chapter._id)
      if (!chapterNumber) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Chapter number not found for chapter id: " + chapter._id)
      }
    responseChapters.push({...chapter.toObject(),
      chapterName: chapterNumber.chapterNumber,
      })
    }
    res.status(httpStatus.OK).send({'courseId': courseId, 
                                        'chapters': responseChapters})
});

const getChapterById = catchAsync(async (req, res) => {
    const { courseId, chapterId } = req.params
    const chapter = await chapterService.getChapterById(chapterId)
    if (!chapter)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")
    if (chapter.courseId != courseId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not part of the course")
    const chapterNumber = await chapterService.getChapterNumberByChapterId(chapterId)

    res.status(httpStatus.OK).send({...chapter.toObject(),
      chapterName: chapterNumber.chapterNumber,
  })
});


const deleteChapter = catchAsync(async (req, res) => {
  const {courseId, chapterId} = req.params

  const chapter = await chapterService.getChapterById(chapterId)
  if (!chapter)
    throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")
  if (chapter.courseId != courseId)
    throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not part of the course")
  if (chapter.creatorId != req.user._id)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to delete the chapter")

  const chapterNum = await chapterService.getChapterNumberByChapterId(chapterId)
  // first remove from the course list
  const course = await courseService.getCourseByCourseId(courseId)
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found, can not delete the chapter")
  }
    
  if (course.creator != req.user._id)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to delete chapter from the course")

  const deletedChapter = await chapterService.deleteChapterById(chapterId)
  if (!deletedChapter) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete the chapter")
  }
  course.chapterIds = course.chapterIds.filter(id => id != chapterId)

  const updateCourseResponse = await course.save()
  if (!updateCourseResponse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update the course")
  }

  const deleteChapterNumberResponse = await chapterService.deleteChapterNumber(chapterId)
  if (!deleteChapterNumberResponse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete the chapter number")
  }
  for (let courseChapterId of course.chapterIds) {
    if (courseChapterId != chapterId) {
      const currentChapterNumber = await chapterService.getChapterNumberByChapterId(courseChapterId)
      if (chapterNum < currentChapterNumber) {
      const updateChapterNumberResponse = await chapterService.updateChapterNumber(courseChapterId,
                                                                  currentChapterNumber.chapterNumber-1)
      if (!updateChapterNumberResponse) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update the chapter number")
      }
    }
  }
  }

  const chapterResponse = deletedChapter.toObject();
  chapterResponse.chapterName = chapterNum.chapterNumber;

  res.status(httpStatus.OK).send(chapterResponse)
});



module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapter
};