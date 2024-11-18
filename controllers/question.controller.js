const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const questionService = require('../services/question.service');
const courseService = require('../services/course.service');
const quizService = require('../services/quiz.service');
const QuestionType = require('../enums/questiontype');
const mongoose = require('mongoose');


/**
 * Create a question
 */
const createQuestion = catchAsync(async (req, res) => {
    const { courseId, quizId } = req.params;
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course) 
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    if (!course.quizIds.includes(mongoose.Types.ObjectId(quizId)))
        throw new ApiError(httpStatus.BAD_REQUEST, "Quiz not found in course");

    req.body.creatorId = req.user._id;
    req.body.courseId = courseId;
    req.body.quizId = quizId;
    validationSolution(req.body.questionType, req.body.solution);
    const question = await questionService.createQuestion(req.body);
    const updatedQuiz =  await quizService.addQuestionToQuiz(quizId, question._id);
    if (!updatedQuiz) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update quiz");
    }
    res.status(httpStatus.CREATED).send(question);
});

const createMultipleQuestions = async (questions, quizId, courseId, creatorId) => {
    questions.forEach(question => {
        validationSolution(question.questionType, question.solution);
        question.courseId = courseId;
        question.creatorId = creatorId;
        question.quizId = quizId;
    });
    return await questionService.createQuestion(questions);
}

const updateMultipleQuestions = async (questions) => {
    for (const updateQuestion of questions) {
        const question = await questionService.getQuestionById(updateQuestion.questionId);
        if (!question) {
            throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
        }

        updateQuestion.content = updateQuestion.content!=null ? updateQuestion.content : question.content;
        updateQuestion.explanation = updateQuestion.explanation!=null ? updateQuestion.explanation : question.explanation;
        if (updateQuestion.solution == null && updateQuestion.questionType!=null)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please pass new solution with new questionType')
            
        if (updateQuestion.solution!=null)
            validationSolution(updateQuestion.questionType, updateQuestion.solution);

        const solution = updateQuestion.solution!=null ? updateQuestion.solution : question.solution;
        updateQuestion.questionType = updateQuestion.questionType!=null ? updateQuestion.questionType : question.questionType;
    
        const response = await questionService.updateQuestion(updateQuestion.questionId, updateQuestion.content, 
                                                                updateQuestion.questionType, solution, updateQuestion.explanation);
        if (!response) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update question");
        }
    }
}

/**
 * Get all questions for a quiz - learner api
 */
const getAllQuestions = catchAsync(async (req, res) => {
    const { quizId } = req.params;
    const quiz =  await quizService.getQuizById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    const response = await questionService.getAllQuestions(quizId);
    const questionsWithoutSolutions = response.map((rest) => {
        return {
            questionId: rest._id,
            question: rest.content,
            questionType: rest.questionType,
            creatorId: rest.creatorId,
            courseId: rest.courseId,
            quizId: rest.quizId,
            createdAt: rest.createdAt,
            updatedAt: rest.updatedAt,
            options: rest.solution!=='string' ? rest.solution.options : "",
        };
    });
    
    res.status(httpStatus.OK).send(questionsWithoutSolutions);
});

/**
 * Get a question by ID
 */
const getQuestionById = catchAsync(async (req, res) => {
    const { quizId, questionId } = req.params;
    const quiz = await quizService.getQuizById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
    }
    if (!quiz.questionIds.some(q => q.toString() === questionId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in quiz");
    }
    const response = await questionService.getQuestionById(questionId);
    if (!response) {
        throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    res.status(httpStatus.OK).send(response);
});

/**
 * Update a question
 */
const updateQuestion = catchAsync(async (req, res) => {
    const {courseId, quizId, questionId} = req.params;
    let { content, questionType } = req.body;
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
        throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    if (question.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in course");
    }
    if (question.quizId.toString() !== quizId.toString()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in quiz");
    }
    if (question.creatorId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to update this question.");
    }

    content = content!=null ? content : question.content;
    questionType = questionType!=null ? questionType : question.questionType;
    if (req.body.solution!=null) {
        validationSolution(questionType, req.body.solution);
    }
    const solution = req.body.solution!=null ? req.body.solution : question.solution;

    const response = await questionService.updateQuestion(questionId, content, questionType, solution);
    res.status(httpStatus.OK).send(response);
});

/**
 * Delete a question
 */
const deleteQuestion = catchAsync(async (req, res) => {
    const { courseId, quizId, questionId } = req.params;    
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
        throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    if (question.quizId.toString() !== quizId.toString()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in quiz");
    }
    if (question.courseId.toString() !== courseId.toString()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question not found in course");
    }
    if (question.creatorId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, "User not allowed to delete this question.");
    }
    const deletedQuestion = await questionService.deleteQuestion(questionId);
    const updatedQuiz = await quizService.removeQuestionFromQuiz(quizId, questionId);
    if (!updatedQuiz) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update quiz");
    }
    res.status(httpStatus.OK).send(deletedQuestion);
});

const validationSolution = (questionType, solution) => {
    if (questionType === QuestionType.TEXT) {
        if (typeof solution !== 'string')
            throw new ApiError(httpStatus.BAD_REQUEST, "For TEXT type, solution must be a string. questionType: " 
                + questionType +  " options: " + solution.options + " solution: " + solution.solution);
    } else if (questionType === QuestionType.SINGLE_CHOICE) {
        if (typeof solution === 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, solution must be solution object. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        if (typeof solution.solution !== 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "For SINGLE_CHOICE type, solution must be a string. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        if (!Array.isArray(solution.options)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For SINGLE_CHOICE type, options must be an array of strings. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        if (!solution.options.includes(solution.solution)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For SINGLE_CHOICE type, solution must be one of the options. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
    } else if (questionType === QuestionType.MULTIPLE_CHOICE) {
        if (typeof solution === 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, solution must be an solution object. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        if (!Array.isArray(solution.solution)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, solution must be an array of strings. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        if (!Array.isArray(solution.options)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, options must be an array of strings. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
        // check if solution elements are unique 
        if (new Set(solution.solution).size !== solution.solution.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, solution must contain unique elements. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }

        if (!solution.solution.every(sol => solution.options.includes(sol))) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, solution must one of the options provided. questionType: " 
                + questionType + " options: " + solution.options + " solution: " + solution.solution);
        }
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid questionType provided.");
    }
};

const checkSubmission = async (questionId, answer) => {
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
        throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }

    let submission = {
        questionIds: question._id,
        answer: answer
    };
    if (question.questionType === QuestionType.SINGLE_CHOICE) {
        if (typeof answer !== 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "For SINGLE_CHOICE type, answer must be a string. questionType: " + question.questionType + " answer: " + question.solution.options + " answer: " + answer);
        }
        if (!question.solution.options.includes(answer)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For SINGLE_CHOICE type, answer must be one of the options provided. questionType: " + question.questionType + " answer: " +question.solution.options + " answer: " + answer);
        }
        if (answer !== question.solution.solution) {
            submission.isCorrect = false;
        } else {
            submission.isCorrect = true;
        }
    }
    if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
        if (!Array.isArray(answer)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "For MULTIPLE_CHOICE type, answer must be an array of strings. questionType: " + questionType + " answer: " + answer);
        }
        if (!question.solution.solution.every(sol => answer.includes(sol))) {
            submission.isCorrect = false;
        } else {
            submission.isCorrect = true;
        }
    }
    if (question.questionType === QuestionType.TEXT) {
        if (typeof answer !== 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "For TEXT type, answer must be a string. questionType: " + questionType + " answer: " + answer);
        }
        if (answer !== question.solution.solution) {
            submission.isCorrect = false;
        } else {
            submission.isCorrect = true;
        }
    }
    return submission;
}


module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    checkSubmission,
    createMultipleQuestions,
    updateMultipleQuestions
};