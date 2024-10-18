const { Chapter } = require("../models");

const create = async (chapter) => {
    return await Chapter.create(chapter);
}

const update = async (chapterId, title, content, isPublished, isFree, chapterNumber) => {
    let filter = { _id: chapterId }
    await Chapter.updateOne(filter, { $set: { 
        title: title,
        content: content,
        isPublished: isPublished,
        isFree: isFree,
        chapterNumber: chapterNumber
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

module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapterById
}   