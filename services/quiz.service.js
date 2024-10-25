const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {Quiz} = require('../models/quiz.model');


const createQuiz = async (quiz) => {
    return await Quiz.create(quiz);
};

const getQuizById = async (quizId) => {
    return Quiz.findById(quizId);
};

const deleteQuiz = async (quizId) => {
    return await Quiz.findByIdAndDelete(quizId)
};

const getQuizsByCourseId = async (courseId) => {
    return await Quiz.find({courseId});
};

const removeQuestionFromQuiz = async (quizId, questionId) => {
    return await Quiz.updateOne(
        { _id: quizId },
        { $pull: { questionIds: questionId } }
    );
};
const addQuestionToQuiz = async (quizId, questionId) => {
    return await Quiz.updateOne(
        { _id: quizId },
        { $push: { questionIds: questionId } }
    );
};

const deleteQuizByCourseId = async (courseId) => {
    return await Quiz.deleteMany({ courseId });
};


module.exports = {
    createQuiz,
    getQuizById,
    deleteQuiz,
    getQuizsByCourseId,
    removeQuestionFromQuiz,
    addQuestionToQuiz,
    deleteQuizByCourseId
};