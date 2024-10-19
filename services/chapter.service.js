const { Chapter } = require("../models");
const { ChapterIdChapterNum } = require("../models");

const create = async (chapter) => {
    return await Chapter.create(chapter);
}

const getChapterNumberByChapterId = async (chapterId) => {
    return await ChapterIdChapterNum.findOne({chapterId: chapterId})
}

const addChapterNumber = async (chapterId, chapterNumber) => {
    return await ChapterIdChapterNum.create({chapterId: chapterId, chapterNumber: chapterNumber})
}

const deleteChapterNumber = async (chapterId) => {
    return await ChapterIdChapterNum.findOneAndDelete({chapterId: chapterId})
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

const updateChapterNumber = async (chapterId, chapterNumber) => {
    return await ChapterIdChapterNum.updateOne({chapterId: chapterId}, {chapterNumber: chapterNumber})
}

module.exports = {
    create,
    update,
    getChaptersByCourseId,
    getChapterById,
    deleteChapterById,
    getChapterNumberByChapterId,
    addChapterNumber,
    deleteChapterNumber,
    updateChapterNumber
}   