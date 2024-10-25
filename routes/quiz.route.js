const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const requiredRoles = require("../middlewares/req.roles");
const quizController = require('../controllers/quiz.controller');
const quizValidation = require('../validations/quiz.validation');

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the quiz
 *         questionIds:
 *           type: array
 *           items:
 *             type: string
 *           description: List of question IDs associated with the quiz
 *         creatorId:
 *           type: string
 *           description: The ID of the user who created the quiz
 *         courseId:
 *           type: string
 *           description: The ID of the course associated with the quiz
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the quiz was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the quiz was last updated
 */

/**
 * @swagger
 * /quizzes/{courseId}:
 *   post:
 *     summary: Create a quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to create a quiz for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - questionIds
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Course not found
 *       403:
 *         description: User not allowed to create a quiz
 */

/**
 * @swagger
 * /quizzes/{courseId}/{quizId}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *       - in: path
 *         name: quizId
 *         required: true
 *         description: ID of the quiz to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *       403:
 *         description: User not allowed to delete this quiz
 */

/**
 * @swagger
 * /quizzes/{courseId}/{quizId}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *       - in: path
 *         name: quizId
 *         required: true
 *         description: ID of the quiz to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /quizzes/{courseId}:
 *   get:
 *     summary: Get all quizzes by course ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quizzes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Course not found
 */


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}

router.post("/:courseId",
    requiredRoles('create'),
    auth,
    requetsBodyLog,
    validate(quizValidation.quizCreate),
    quizController.createQuiz)

router.delete("/:courseId/:quizId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(quizValidation.quizDelete),
    quizController.deleteQuiz)

router.get("/:courseId/:quizId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(quizValidation.quizGetById),
    quizController.getQuizById)

router.get("/:courseId",
    requiredRoles('search'),
    auth,
    requetsBodyLog,
    validate(quizValidation.quizGetByCourseId),
    quizController.getQuizsByCourseId    
)


module.exports = router;