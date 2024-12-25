const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const requiredRoles = require("../middlewares/req.roles");
const courseEnrollController = require('../controllers/courseEnroll.controller.js');
const courseEnrollValidation = require('../validations/courseEnroll.validation');


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Enroll:
 *       type: object
 *       properties:
 *         paymentToken:
 *           type: string
 *           description: The payment token for the course enrollment
 *       required:
 *         - paymentToken
 *     CourseEnrollment:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           courseId:
 *             type: string
 *             description: Unique identifier for the course
 *           learnerIds:
 *             type: array
 *             items:
 *               type: string
 *             description: Array of learner IDs enrolled in the course
 * 
 * /enroll/{courseId}:
 *   put:
 *     summary: Enroll a learner in a course
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enroll'
 *     responses:
 *       "200":
 *         description: Successfully enrolled
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Course not found
 * 
 *   delete:
 *     summary: Unenroll a learner from a course
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       "200":
 *         description: Successfully unenrolled
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Course not found
 * 
 * /enroll:
 *   get:
 *     summary: Get all courses a learner is enrolled in
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseEnrollment'
 *       "401":
 *         description: Unauthorized
 */

router.put("/:courseId",
    requiredRoles('learner'),
    auth,
    requetsBodyLog,
    validate(courseEnrollValidation.enrollLearner),
    courseEnrollController.enrollLearner
)

router.delete("/:courseId",
    requiredRoles('learner'),
    auth,
    requetsBodyLog,
    validate(courseEnrollValidation.unenrollLearner),
    courseEnrollController.unenrollLearner
)

router.get("/",
    requiredRoles('learner'),
    auth,
    requetsBodyLog,
    courseEnrollController.learnerEnrolledCourses
)

module.exports = router