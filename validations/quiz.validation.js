const Joi = require('joi');
const { objectId, questionType } = require('./custom.validation');

const quizCreate = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        questions: Joi.array().items(Joi.object().keys({
            content: Joi.string().required(),
            explanation: Joi.string().optional(),
            questionType: Joi.string().custom(questionType).required(),
            solution: Joi.alternatives().try(Joi.string(), Joi.object({
                solution: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
                options: Joi.array().items(Joi.string())
            })).required()
        }))
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

const quizUpdate = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        questions: Joi.array().items(Joi.object().keys({
            questionId: Joi.string().custom(objectId).required(),
            content: Joi.string().optional(),
            explanation: Joi.string().optional(),
            questionType: Joi.when('solution', {
                is: Joi.exist(),
                then: Joi.string().custom(questionType).required(),
                otherwise: Joi.string().custom(questionType).optional()
            }),
            solution: Joi.alternatives().try(Joi.string(), Joi.object({
                solution: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
                options: Joi.array().items(Joi.string())
            })).optional()
        })).optional(),
        title: Joi.string().optional(),
        description: Joi.string().optional(),
    }).unknown(true)
};  

const quizOverwriteQuestions = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        questions: Joi.array().items(Joi.object().keys({
            content: Joi.string().required(),
            questionType: Joi.string().custom(questionType).required(),
            solution: Joi.alternatives().try(Joi.string(), Joi.object({
                solution: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
                options: Joi.array().items(Joi.string())
            })).required()
        }))
    }).unknown(true),
};


const quizGetSubmissions = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
};

const quizGetForLearner = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    })
};


module.exports = { 
    quizCreate,
    quizDelete,
    quizGetById,
    quizGetByCourseId,
    quizSubmit,
    quizGetSubmissions,
    quizUpdate,
    quizGetForLearner,
    quizOverwriteQuestions
};