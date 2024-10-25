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

const search = async (keyword, tags, skip, limit) => {
    let courses;
    let totalItems;
    let searchAllFilter = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
    ]
    let tagsFilter ={ tags: { $in: tags } }

    if (!keyword && (!tags || tags.length === 0)) {
        courses = await Course.find({})
                                .skip(skip)
                                .limit(limit);
        totalItems = await Course.countDocuments({});

    } else if (keyword && (!tags || tags.length === 0)) {
        // If only keyword is provided, use regex for partial matching
        courses = await Course.find({
            $or: searchAllFilter
        })
        .skip(skip)
        .limit(limit);
        totalItems = await Course.countDocuments({
            $or: searchAllFilter
        });

    } else if (tags && tags.length > 0 && !keyword) {
        // If only tags are provided
        courses = await Course.find(tagsFilter)
                                .skip(skip)
                                .limit(limit);
        totalItems = await Course.countDocuments(tagsFilter);

    } else {
        // If both keyword and tags are provided
        courses = await Course.find({
            $and: [
                {
                    $or: searchAllFilter
                },
                tagsFilter
            ]
        })
        .skip(skip)
        .limit(limit);
        totalItems = await Course.countDocuments({
            $and: [
                {
                    $or: searchAllFilter
                },
                tagsFilter
            ]
        });
    }
    return {
        courses,
        totalPages: Math.ceil(totalItems / limit)
    };
}

const getCourseByCourseId = async (courseId) => {
    return await Course.findOne({_id: courseId})
}

const getCourseByCreatorId = async (creatorId, skip, limit) => {
    const courses = await Course.find({creator: creatorId})
                        .skip(skip)
                        .limit(limit);
    const totalItems = await Course.countDocuments({creator: creatorId});
    return {
        courses,
        totalPages: Math.ceil(totalItems / limit)
    };
}

const deleteCourseById = async (courseId) => {
    return await Course.findByIdAndDelete(courseId)
}

const removeQuizFromCourse = async (courseId, quizId) => {
    return await Course.updateOne({_id: courseId}, {$pull: {quizIds: quizId}})
}

const addQuizToCourse = async (courseId, quizId) => {
    return await Course.updateOne({_id: courseId}, {$push: {quizIds: quizId}})
}


module.exports = {
  create,
  update,
  search,
  getCourseByCourseId,
  deleteCourseById,
  getCourseByCreatorId,
  removeQuizFromCourse,
  addQuizToCourse
};