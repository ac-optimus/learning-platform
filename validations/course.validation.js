const Joi = require("joi");
const { objectId } = require("./custom.validation");


const courseCreate = {
    body: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      creator: Joi.string().required(),
      tags: Joi.array().items(Joi.string()),
      price: Joi.number(),
      chapterIds: Joi.array().items(Joi.string()),
      isPublished: Joi.string()
}).unknown(true),
};

const courseUpdate = {
  body: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
    title: Joi.string(),
    description: Joi.string(),
    addTags: Joi.array().items(Joi.string()),
    removeTags: Joi.array().items(Joi.string()),
    addChapters: Joi.array().items(Joi.string()),
    removeChapters: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean()
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


module.exports = {
  courseCreate,
  courseUpdate,
  courseDelete,
  getCourse
};