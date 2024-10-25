const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const requiredRoles = require("../middlewares/req.roles");
const questionController = require('../controllers/question.controller');
const questionValidation = require('../validations/question.validation.js');


const requestBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}

router.post("/:courseId/:quizId/",
    requiredRoles('create'),
    auth,
    requestBodyLog,
    validate(questionValidation.createQuestion),
    questionController.createQuestion);

router.put("/:courseId/:quizId/:questionId",
    requiredRoles('update'),
    auth,
    requestBodyLog,
    validate(questionValidation.updateQuestion),
    questionController.updateQuestion);

router.delete("/:courseId/:quizId/:questionId",
    requiredRoles('update'),
    auth,
    requestBodyLog,
    validate(questionValidation.deleteQuestion),
    questionController.deleteQuestion);

router.get("/:courseId/:quizId",
    requiredRoles('update'),
    auth,
    requestBodyLog,
    validate(questionValidation.getAllQuestions),
    questionController.getAllQuestions);

router.get("/:courseId/:quizId/:questionId",
    requiredRoles('update'),
    auth,
    requestBodyLog,
    validate(questionValidation.getQuestionById),
    questionController.getQuestionById);




module.exports = router;