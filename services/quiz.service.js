const { Quiz } = require('../models/quiz.model');
const { Submission } = require('../models/submission.model');
const { Question } = require('../models/question.model');


const createQuiz = async (quiz, quizId) => {
    const createdQuiz = await Quiz.create({...quiz, _id: quizId});
    const updatedQuiz = await Quiz.findById(createdQuiz._id).populate('questions');
    return updatedQuiz;
};

const getQuizById = async (quizId) => {
    const updatedQuiz = await Quiz.findById(quizId).populate('questions');
    return updatedQuiz;
};

const deleteQuiz = async (quizId) => {
    const quiz = await getQuizById(quizId);
    await Question.deleteMany({ quizId: quizId });
    await Quiz.findByIdAndDelete(quizId);
    return quiz;
};

const getQuizsByCourseId = async (courseId) => {
    const updatedQuizs = await Quiz.find({courseId}).populate('questions');
    return updatedQuizs;
};

const removeQuestionFromQuiz = async (quizId, question) => {
    const updatedQuiz = await Quiz.findById(quizId);    
    updatedQuiz.questions = updatedQuiz.questions.filter(q => q._id.toString() !== question.questionId.toString());
    await updatedQuiz.save();
    await Question.findByIdAndDelete(question.questionId);
    return updatedQuiz;
};

const addQuestionToQuiz = async (quizId, question) => {
    const updatedQuestion = await Question.findById(question.questionId);
    updatedQuestion.quizId = quizId;
    await updatedQuestion.save();
    return await Quiz.findById(quizId).populate('questions');
};

const updateQuizQuestions = async (quizId, questions) => {
    await Quiz.updateOne(
        { _id: quizId },
        { $set: { questions: questions } }
    );
    return await Quiz.findById(quizId).populate('questions');
};

const deleteQuizByCourseId = async (courseId) => {
    await Question.deleteMany({ courseId: courseId });
    return await Quiz.deleteMany({ courseId });
};

const submitQuiz = async (submissions, quizId, courseId, learnerId) => {
    return await Submission.create({ quizId: quizId, courseId: courseId, 
                                        submissions: submissions, learnerId: learnerId });
};

const getSubmissions = async (quizId, courseId, learnerId) => {
    return await Submission.find({ quizId: quizId, courseId: courseId, learnerId: learnerId });
};

const updateQuiz = async (quizId, courseId, title, description) => {
    await Quiz.updateOne({ _id: quizId, courseId: courseId }, 
        { title: title, description: description });
    return await Quiz.findById(quizId).populate('questions');
};

const overwriteQuestions = async (quizId, questions) => {
    await Question.deleteMany({ quizId: quizId });
    return await Question.create(questions);
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
    getSubmissions,
    updateQuiz,
    overwriteQuestions,
    updateQuizQuestions
};
