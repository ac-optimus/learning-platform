const Joi = require("joi");
const { objectId } = require("./custom.validation");

const chapterCreate = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        chapterNumber: Joi.number().required(),
        isFree: Joi.boolean(),
        isPublished: Joi.boolean()
    }),
};

const chapterUpdate = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        chapterId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        content: Joi.string(),
        isPublished: Joi.boolean(),
        isFree: Joi.boolean(),
        chapterNumber: Joi.number()
    }),
};

const chapterDelete = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        chapterId: Joi.string().required().custom(objectId)
    }),
};

const chapterGetByCourseId = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
};

const chapterGetById = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        chapterId: Joi.string().required().custom(objectId)
    }),
};



module.exports = {
    chapterCreate,
    chapterUpdate,
    chapterDelete,
    chapterGetByCourseId,
    chapterGetById
};