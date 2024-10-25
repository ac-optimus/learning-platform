const Joi = require('joi');
const { objectId } = require('./custom.validation');

const quizCreate = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        questionIds: Joi.array().items(Joi.string().custom(objectId)).optional()
    }).unknown(true),
};

const quizDelete = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    })
};

const quizGetById = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
};

const quizGetByCourseId = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
};


module.exports = { 
    quizCreate,
    quizDelete,
    quizGetById,
    quizGetByCourseId
};