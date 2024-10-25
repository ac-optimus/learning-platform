const Joi = require('joi');
const { objectId, questionType } = require('./custom.validation');


const createQuestion = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
    body: {
        content: Joi.string().required(),
        questionType: Joi.string().custom(questionType).required(),
        solution: Joi.alternatives().try(
            Joi.string(),
            Joi.object({
                solution: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
                options: Joi.array().items(Joi.string())
            })
        ).required() 
    }
};

const updateQuestion = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId),
        questionId: Joi.string().required().custom(objectId)
    }),
    body: {
        content: Joi.string().optional(),
        questionType: Joi.string().custom(questionType),
        solution: Joi.alternatives().try(
            Joi.string(),
            Joi.object({
                solution: Joi.string(),
                options: Joi.array().items(Joi.string())
            })
        ).optional()
    }
};

const deleteQuestion = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId),
        questionId: Joi.string().required().custom(objectId)
    }),
};

const getQuestionById = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId),
        questionId: Joi.string().required().custom(objectId)
    }),
};

const getAllQuestions = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId),
        quizId: Joi.string().required().custom(objectId)
    }),
};



module.exports = { 
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionById,
    getAllQuestions
};