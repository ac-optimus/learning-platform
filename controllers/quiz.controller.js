const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const quizService = require('../services/quiz.service');
const courseService = require('../services/course.service');
const questionService = require('../services/question.service');
const catchAsync = require('../utils/catchAsync');
const questionController = require('./question.controller');
const mongoose = require('mongoose');
const { objectId } = require('../validations/custom.validation');


/**
 * Create a quiz
 */
const createQuiz = catchAsync(async (req, res) => {
    const { questions, title, description } = req.body;
    const { courseId } = req.params;
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course doesn't exist.");
    }
    if (course.creator !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to create a quiz for this course.");
    }
    // random number generator for quiz id same as mongoose id
    const quizId = new mongoose.Types.ObjectId();

    if (questions) {
        const createdQuestions = await questionController.createMultipleQuestions(questions, quizId, courseId, req.user._id);
        req.body.questions = createdQuestions;
    }

    req.body.creatorId = req.user._id;
    req.body.courseId = courseId;
    // return a response where quiz has questions as well
    const response = await quizService.createQuiz(req.body, quizId);
    if (!response) {
        throw new ApiError(httpStatus.NOT_FOUND, "Can not create quiz");
    }
    const addQuizToCourseResponse = await courseService.addQuizToCourse(courseId, response._id);
    if (!addQuizToCourseResponse) {
        throw new ApiError(httpStatus.NOT_FOUND, "Can not add quiz to course");
    }
    res.status(httpStatus.CREATED).send(response);
});

/**
 * Get a quiz by ID
 */
const getQuizById = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const quiz = await quizService.getQuizById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (quiz.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    res.status(httpStatus.OK).send(quiz);
});

/**
 * Delete a quiz
 */
const deleteQuiz = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    let quiz = await quizService.getQuizById(quizId)
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (quiz.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    if (quiz.creatorId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to delete this quiz.");
    }

    const deleteQuizResponse = await quizService.deleteQuiz(quizId);
    if (!deleteQuizResponse) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }

    const deleteQuestionsResponse = await questionService.deleteQuestions(quiz.questionIds);
    if (!deleteQuestionsResponse) {
        throw new ApiError(httpStatus.NOT_FOUND, "Can not delete questions");
    }

    const course = await courseService.removeQuizFromCourse(courseId, quizId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Can not remove quiz from course");
    }

    res.status(httpStatus.OK).send(deleteQuizResponse);
});

/**
 * Get a quiz by course ID
 */
const getQuizsByCourseId = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const response = await quizService.getQuizsByCourseId(courseId);
    res.status(httpStatus.OK).send(response);
}); 

const submitQuiz = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const quiz = await quizService.getQuizById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (quiz.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    // itereate this for all the questionIds in quiz
    if (req.body.answers.length !== quiz.questions.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Answers not provided for all the questions");
    }

    const submissions = [];
    const learnerAnswers = req.body.answers;
    // itereate over all questionids and solutions as well which js part of req.body.answers
    for (const answer of learnerAnswers) {
        const submission = await questionController.checkSubmission(answer.questionId, answer.answer);
        submissions.push(submission);
    }   
    const response = await quizService.submitQuiz(submissions, quizId, courseId, req.user._id);
    res.status(httpStatus.OK).send(response);
});

const getSubmissions = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const learnerId = req.user._id;
    const response = await quizService.getSubmissions(quizId, courseId, learnerId);
    res.status(httpStatus.OK).send(response);
});

const updateQuiz = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    let { questions, title, description } = req.body;

    const quiz = await quizService.getQuizById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (quiz.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    if (quiz.creatorId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to update this quiz.");
    }
    if (questions) {
        for (const question of questions) {
            if (!quiz.questions.some(q => q._id.toString() === question.questionId)) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in quiz");
            }
        }
        const updatedQuestions = await questionController.updateMultipleQuestions(questions);
        req.body.questions = updatedQuestions;
    }
    title = title != null ? title : quiz.title;
    description = description != null ? description : quiz.description;
    const response = await quizService.updateQuiz(quizId, courseId, title, description);
    res.status(httpStatus.OK).send(response);
});

const getQuizForLearner = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const response = await quizService.getQuizById(quizId);
    if (!response) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (response.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    // remove the solution from the questions
    const questionsWithoutSolutions = response.questions.map((question) => {
        return {
            questionId: question._id,
            question: question.content,
            questionType: question.questionType,
            options: question.solution!=='string' ? question.solution.options : question.solution
        };
    });
    res.status(httpStatus.OK).send(questionsWithoutSolutions);
});

const overwriteQuestions = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const { questions } = req.body;
    const quiz = await quizService.getQuizById(quizId);

    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (quiz.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not part of passed course.");
    }
    if (quiz.creatorId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to overwrite questions for this quiz.");
    }
    // delete all the questions in the quiz
    const deleteQuestionsResponse = await questionService.deleteQuestions(quiz.questionIds);
    if (!deleteQuestionsResponse) {
        throw new ApiError(httpStatus.NOT_FOUND, "Can not delete questions");
    }
    const updatedQuestions = await questionController.createMultipleQuestions(questions, quizId, courseId, req.user._id);
    req.body.questions = updatedQuestions;
    const response = await quizService.updateQuizQuestions(quizId, req.body.questions);
    res.status(httpStatus.OK).send(response);
});


module.exports = {
    createQuiz,
    getQuizById,
    deleteQuiz,
    getQuizsByCourseId,
    submitQuiz,
    getSubmissions,
    updateQuiz,
    getQuizForLearner,
    overwriteQuestions
};