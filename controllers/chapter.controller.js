const httpStatus = require("http-status");
const {chapterService, courseService} = require("../services");
const  ApiError  = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");


const create = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    let course = await getCourseByCourseId(courseId, req.user._id)
    let chapterIds = course.chapterIds
    if (await checkIfChapterNumberExists(courseId, req.body.chapterNumber))
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

    res.status(httpStatus.CREATED).send({...chapter.toObject(),
        chapterName: req.body.chapterNumber,
  })
});

const checkIfChapterNumberExists = async (courseId, chapterNumber) => {
    let chapter = await chapterService.getChapterFromChapterNumber(chapterNumber, courseId)
    if (chapter)
      return true
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
    let chapter = await chapterService.getChapterByIdAndCourseIdAndCreatorId(chapterId, courseId, req.user._id)
    if (!chapter)
      throw new ApiError(httpStatus.BAD_REQUEST, "Chapter not found")  

    title = title!=null ? title : chapter.title;
    content = content!=null ? content : chapter.content;
    isPublished = isPublished!=null ? isPublished : chapter.isPublished;
    isFree = isFree!=null ? isFree : chapter.isFree;

    const udpateChapterResponse = await chapterService.update(chapterId, title, content, isPublished, isFree)
    if (!udpateChapterResponse)
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update the chapter")

    res.status(httpStatus.OK).send(udpateChapterResponse)
  })

const getChaptersByCourseId = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const course = await courseService.getCourseByCourseId(courseId)
    if (!course)
      throw new ApiError(httpStatus.BAD_REQUEST, "Course not found")
    const chapters = await chapterService.getChaptersByCourseId(courseId)
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
  const chapterNumbersUpdated = await chapterService.updateChapterNumbers(chapter.chapterNumber)  
  if (!chapterNumbersUpdated)
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update chapterNumber field for consecutive chatpers")

  res.status(httpStatus.OK).send(deletedChapter)
});



module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapter
};