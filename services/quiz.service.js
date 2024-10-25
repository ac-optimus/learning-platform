const { Quiz } = require('../models/quiz.model');
const { Submission } = require('../models/submission.model');


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

const submitQuiz = async (submissions, quizId, courseId, learnerId) => {
    return await Submission.create({ quizId: quizId, courseId: courseId, 
                                        submissions: submissions, learnerId: learnerId });
};

const getSubmissions = async (quizId, courseId, learnerId) => {
    return await Submission.find({ quizId: quizId, courseId: courseId, learnerId: learnerId });
};


module.exports = {
    createQuiz,
    getQuizById,
    deleteQuiz,
    getQuizsByCourseId,
    removeQuestionFromQuiz,
    addQuestionToQuiz,
    deleteQuizByCourseId,
    submitQuiz,
    getSubmissions
};