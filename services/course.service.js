const { Course } = require("../models");

const create = async (course) => {
    return await Course.create(course);
}

const update = async (courseId, title, description, tags, chapterIds, isPublished) => {
    let filter = { _id: courseId }
    await Course.updateOne(filter, { $set: { 
        title: title,
        description: description,
        tags: tags,
        chapterIds: chapterIds,
        isPublished: isPublished
        } 
    })
    return await Course.findOne({_id: courseId})
}

const search = async (keyword, tags) => {
    return Course.find({})
}

const getCourseByCourseId = async (courseId) => {
    return await Course.findOne({_id: courseId})
}


const deleteCourseById = async (courseId) => {
    return await Course.findByIdAndDelete(courseId)
}


module.exports = {
  create,
  update,
  search,
  getCourseByCourseId,
  deleteCourseById
};