const { Chapter } = require("../models");


const create = async (chapter) => {
    return await Chapter.create(chapter);
}

const getChapterFromChapterNumber = async (chapterNumber, courseId) => {
    return await Chapter.findOne({chapterNumber: chapterNumber, courseId: courseId})
}

const updateChapterNumbers = async (graterThanChapterCount) => {
    return await Chapter.updateMany(
        { chapterNumber: { $gt: graterThanChapterCount } },
        { $inc: { chapterNumber: -1 } }
    );
}

const update = async (chapterId, title, content, isPublished, isFree) => {
    let filter = { _id: chapterId }
    await Chapter.updateOne(filter, { $set: { 
        title: title,
        content: content,
        isPublished: isPublished,
        isFree: isFree
        } 
    })
    return await Chapter.findOne({_id: chapterId})
}

const getChaptersByCourseId = async (courseId) => {
    return await Chapter.find({courseId: courseId})
}

const getChapterById = async (chapterId) => {
    return await Chapter.findOne({_id: chapterId})
}

const deleteChapterById = async (chapterId) => {
    return await Chapter.findByIdAndDelete(chapterId)
}

const getChapterByIdAndCourseId = async (chapterId, courseId) => {
    return await Chapter.findOne({_id: chapterId, courseId: courseId})
}

const getChapterByIdAndCourseIdAndCreatorId = async (chapterId, courseId, creatorId) => {
    return await Chapter.findOne({_id: chapterId, courseId: courseId, creatorId: creatorId})
}

module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapterById,
    getChapterFromChapterNumber,
    getChapterByIdAndCourseId,
    getChapterByIdAndCourseIdAndCreatorId,
    updateChapterNumbers
}   
