const { Question } = require('../models');

const createQuestion = async (question) => {
    return await Question.create(question);
};

const getAllQuestions = async (quizId) => {
    return await Question.find({ quizId });
};

const getQuestionById = async (questionId) => {
    return await Question.findById(questionId);
};

const updateQuestion = async (questionId, content, questionType, solution) => {
    let filter = { _id: questionId }
    await Question.updateOne(filter, { $set: { 
        content: content,
        questionType: questionType,
        solution: solution
        } 
    })
    return await Question.findOne({_id: questionId})
};

const deleteQuestion = async (questionId) => {
    return await Question.findOneAndDelete({ _id: questionId });
};

const deleteQuestions = async (questionIds) => {
    return await Question.deleteMany({ _id: { $in: questionIds } });
};


module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    deleteQuestions
};