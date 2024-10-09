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
    let courses;
    if (!keyword && (!tags || tags.length === 0)) {
        courses = await Course.find({})
    } else if (keyword && (!tags || tags.length === 0)) {
        // If only keyword is provided, use regex for partial matching
        courses = await Course.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { tags: { $regex: keyword, $options: 'i' } }
            ]
        });
    } else if (tags && tags.length > 0 && !keyword) {
        // If only tags are provided
        courses = await Course.find({ tags: { $in: tags } });
    } else {
        // If both keyword and tags are provided
        courses = await Course.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                        { tags: { $regex: keyword, $options: 'i' } }
                    ]
                },
                { tags: { $in: tags } }
            ]
        });
    }
    return courses;
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