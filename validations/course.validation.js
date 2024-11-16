const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { courseCategory } = require("./custom.validation");

const courseCreate = {
    body: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      shortBio: Joi.string(),
      image: Joi.string(),
      creator: Joi.string().required(),
      tags: Joi.array().items(Joi.string()),
      price: Joi.number().required(),
      chapterIds: Joi.array().items(Joi.string()),
      isPublished: Joi.string(),
      category: Joi.string().custom(courseCategory).required(),
      contentOrder: Joi.array().items(Joi.string())
}).unknown(true),
};

const courseUpdate = {
  body: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
    title: Joi.string(),
    description: Joi.string(),
    shortBio: Joi.string(),
    image: Joi.string(),
    addTags: Joi.array().items(Joi.string()),
    removeTags: Joi.array().items(Joi.string()),
    addChapters: Joi.array().items(Joi.string()),
    removeChapters: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean(),
    contentOrder: Joi.array().items(Joi.string())
}).unknown(true),
};

const courseDelete = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId)
}).unknown(true),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId)
}).unknown(true),
};

const getCourseByCreatorId = {
  params: Joi.object().keys({
    creatorId: Joi.string().required().custom(objectId)
}).unknown(true),
};

const searchCourse = {
  query: Joi.object().keys({
    category: Joi.string().custom(courseCategory)
  }).unknown(true)
}

const setCourseCommission = {
  body: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
    creatorShare: Joi.number().required().min(0).max(100).messages({
      'number.min': 'Creator share cannot be less than 0',
      'number.max': 'Creator share cannot be greater than 100'
    })
  }).unknown(true),
}

const getCommissionForCreator = {
    query: Joi.object().keys({
        creatorId: Joi.string().custom(objectId),
        courseId: Joi.string().custom(objectId)
    }).unknown(true).optional()

}

const deleteCourseCommission = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId)
  }).unknown(true),
};

const updateCourseCommission = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId)
  }).unknown(true),
  body: Joi.object().keys({
    creatorShare: Joi.number().required().min(0).max(100).messages({
      'number.min': 'Creator share cannot be less than 0',
      'number.max': 'Creator share cannot be greater than 100'
    })
  }).unknown(true),
};



module.exports = {
  courseCreate,
  courseUpdate,
  courseDelete,
  getCourse,
  getCourseByCreatorId,
  searchCourse,
  setCourseCommission,
  getCommissionForCreator,
  deleteCourseCommission,
  updateCourseCommission
};
