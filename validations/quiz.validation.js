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

const quizSubmit = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        answers: Joi.array().items(Joi.object().keys({  
            questionId: Joi.string().required().custom(objectId),
            answer: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()))
        })).required()
    })
};

const quizGetSubmissions = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
};


module.exports = { 
    quizCreate,
    quizDelete,
    quizGetById,
    quizGetByCourseId,
    quizSubmit,
    quizGetSubmissions
};