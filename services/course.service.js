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

const search = async (keyword, tags, category, skip, limit) => {
    console.log(keyword, tags, category, skip, limit)    
    let isPublishedFilter = { isPublished: true }
    let categoryFilter = category!=null ? { category: category } : {}
    let courses;
    let totalItems;
    let searchAllFilter = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
    ]

    let tagsFilter ={ tags: { $in: tags } }

    if (!keyword && (!tags || tags.length === 0)) {
        courses = await Course.find(isPublishedFilter)
                                .find(categoryFilter)
                                .skip(skip)
                                .limit(limit);
        totalItems = await Course.countDocuments(isPublishedFilter)
                                .countDocuments(categoryFilter);

    } else if (keyword && (!tags || tags.length === 0)) {
        // If only keyword is provided, use regex for partial matching
        courses = await Course
            .find({
                $and: [
                    categoryFilter,
                    isPublishedFilter,
                    {
                    $or: searchAllFilter
                }
            ]
        })
        .skip(skip)
        .limit(limit);
        totalItems = await Course.countDocuments({
            $and: [
                categoryFilter,
                isPublishedFilter,
                {
                    $or: searchAllFilter
                }
            ]
        })
    } else if (tags && tags.length > 0 && !keyword) {
        // If only tags are provided
        courses = await Course.find(isPublishedFilter)
                                .find(tagsFilter)
                                .find(categoryFilter)
                                .skip(skip)
                                .limit(limit);
        totalItems = await Course.countDocuments(isPublishedFilter)
                                .countDocuments(tagsFilter)
                                .countDocuments(categoryFilter);

    } else {
        // If both keyword and tags are provided
        courses = await Course.find(isPublishedFilter)
                                .find({
                                    $and: [
                                        {
                                            $or: searchAllFilter
                                        },
                                        tagsFilter
                                    ]
                                }
                            )
                            .find(categoryFilter)
                            .skip(skip)
                            .limit(limit);
        totalItems = await Course.countDocuments(isPublishedFilter)
                                .countDocuments({
                                    $and: [
                                        {
                                            $or: searchAllFilter
                                        },
                                        tagsFilter
                                    ]
                                }
                            )
                            .countDocuments(categoryFilter);
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
    const course = await Course.findOne({_id: courseId});
    course.quizIds = course.quizIds.filter(id => id.toString() !== quizId.toString());
    return await course.save();
}

const addQuizToCourse = async (courseId, quizId) => {
    const course = await Course.findOne({_id: courseId});
    course.quizIds.push(quizId);
    return await course.save();
}

const getAllCourses = async () => {
    return await Course.find();
}


module.exports = {
  create,
  update,
  search,
  getCourseByCourseId,
  deleteCourseById,
  getCourseByCreatorId,
  removeQuizFromCourse,
  addQuizToCourse,
  getAllCourses
};