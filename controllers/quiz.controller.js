const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const quizService = require('../services/quiz.service');
const courseService = require('../services/course.service');
const questionService = require('../services/question.service');
const catchAsync = require('../utils/catchAsync');
const questionController = require('./question.controller');


/**
 * Create a quiz
 */
const createQuiz = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course doesn't exist.");
    }
    if (course.creator !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to create a quiz for this course.");
    }
    const { questionIdsSolutionIds } = req.body;
    req.body.creatorId = req.user._id;
    req.body.courseId = courseId;
    const response = await quizService.createQuiz(req.body);
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
    if (req.body.answers.length !== quiz.questionIds.length) {
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
    console.log(quizId, courseId, learnerId);
    const response = await quizService.getSubmissions(quizId, courseId, learnerId);
    res.status(httpStatus.OK).send(response);
});


module.exports = {
    createQuiz,
    getQuizById,
    deleteQuiz,
    getQuizsByCourseId,
    submitQuiz,
    getSubmissions
};