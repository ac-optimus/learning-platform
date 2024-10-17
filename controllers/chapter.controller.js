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

    res.status(httpStatus.CREATED).send(chapter)
});

const getCourseByCourseId = async (courseId, userId) => {
  let course = await courseService.getCourseByCourseId(courseId)
  if (!course) 
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
  if (course.creator != userId)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to update the course")
  return course
}

const update = catchAsync(async (req, res) => {
  // no need to fetch coures for courseId passed
    const {chapterId, courseId} = req.params;
    let {title, content, isPublished, isFree, chapterNumber} = req.body

    let chapter = await chapterService.getChapterById(chapterId)
    title = title!=null ? title : chapter.title;
    content = content!=null ? content : chapter.content;
    isPublished = isPublished!=null ? isPublished : chapter.isPublished;
    isFree = isFree!=null ? isFree : chapter.isFree;
    chapterNumber = chapterNumber!=null ? chapterNumber : chapter.chapterNumber;

    if (chapter.courseId != courseId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not part of the course")
    if (chapter.creatorId != req.user._id)
      throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to update the chapter")

    const udpateChapterResponse = await chapterService.update(chapterId, title, content, isPublished, isFree, chapterNumber)
    if (!udpateChapterResponse)
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update the chapter")

    res.status(httpStatus.OK).send(udpateChapterResponse)
}); 

const getChaptersByCourseId = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const course = await courseService.getCourseByCourseId(courseId)
    const chapters = await Promise.all(course.chapterIds.map(id => chapterService.getChapterById(id)))
    res.status(httpStatus.OK).send({'courseId': courseId, 
                                        'chapters': chapters})
});

const getChapterById = catchAsync(async (req, res) => {
    const { courseId, chapterId } = req.params
    const chapter = await chapterService.getChapterById(chapterId)
    if (!chapter)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")
    if (chapter.courseId != courseId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not part of the course")
    res.status(httpStatus.OK).send(chapter)
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

  // first remove from the course list
  const course = await courseService.getCourseByCourseId(courseId)
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course not found, can not delete the chapter")
  }
    
  if (course.creator != req.user._id)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not authroized to delete chapter from the course")

  course.chapterIds = course.chapterIds.filter(id => id != chapterId)

  const deletedChapter = await chapterService.deleteChapterById(chapterId)
  if (!deletedChapter) {
    course.chapterIds.push(chapterId)
    await course.save() // any error will be handled by the caller
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete the chapter")
  }

  await course.save()
  res.status(httpStatus.OK).send(deletedChapter)
});



module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapter
};