const express = require("express");
const validate = require("../middlewares/validate");
const courseValidation = require("../validations/course.validation");
const { auth } = require("../middlewares/auth");
const courseController = require("../controllers/course.controller");
const requiredRoles = require("../middlewares/req.roles");
const router = express.Router();


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}

/**
 * @swagger
 * /v1/course:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreate'
 *     responses:
 *       '201':
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 * 
 * components:
 *   schemas:
 *     CourseCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - creator
 *         - price
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         shortBio:
 *           type: string
 *         image:
 *           type: string
 *         creator:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           type: number
 *         chapterIds:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 */
router.post("/",
    requiredRoles('create'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseCreate),
    courseController.create)

/**
 * @swagger
 * /v1/course:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseUpdate'
 *     responses:
 *       '200':
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 * 
 * components:
 *   schemas:
 *     CourseUpdate:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId: 
 *           type: string
 *           description: Must be valid courseId
 *           required: true
 *         title:
 *           type: string
 *           required: false    
 *         description:
 *           type: string
 *           required: false
 *         shortBio:
 *           type: string
 *           required: false
 *         addTags:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         removeTags:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         addChapters:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         removeChapters:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         shortBio:
 *           type: string
 *         image:
 *           type: string
 *         creator:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         chapterIds:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *   responses:
 *     BadRequest:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/errorSchemas/Error'
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/errorSchemas/Error'
 *     NotFound:
 *       description: Course not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/errorSchemas/Error'
 *   errorSchemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string  
 */
router.put("/",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseUpdate),
    courseController.update)

/**
 * @swagger
 * /course/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * 
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         shortBio:
 *           type: string 
 *         image:
 *           type: string
 *         creator:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           type: number
 *         chapterIds:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 */
router.delete("/:courseId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseDelete),
    courseController.deleteCourse)

/**
 * @swagger
 * /course/search:
 *   get:
 *     summary: Search for courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in course title, description, or tags
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of tags to filter courses
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 allTags:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/search",
    requiredRoles('search'),
    requetsBodyLog,
    validate(courseValidation.searchCourse),
    courseController.search)

/**
 * @swagger
 * /v1/course/search/{courseId}:
 *   get:
 *     summary: Get a course by its ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/search/:courseId",
    requiredRoles('search'),
    requetsBodyLog,
    validate(courseValidation.getCourse),
    courseController.searchCourseById)

/**
 * @swagger
 * /v1/course/fetchCourses/{creatorId}:
 *   get:
 *     summary: Fetch courses by creator ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the creator to fetch courses for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successful response containing courses and pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 allTags:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/fetchCourses/:creatorId",
    requiredRoles('create'),
    auth,
    requetsBodyLog,
    validate(courseValidation.getCourseByCreatorId),
    courseController.searchCourseByCreatorId)

router.get("/categoryAndTags",
    requiredRoles('search'),
    requetsBodyLog,
    courseController.categoryAndTags)

// admin routes
router.get("/allCourses",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getAllCourses)

router.get("/allCourseIds",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getAllCourseIds)

router.post("/commission",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.setCourseCommission),
    courseController.setCourseCommission)

router.delete("/commission/:courseId",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.deleteCourseCommission),
    courseController.deleteCourseCommission)

router.put("/commission/:courseId",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.updateCourseCommission),
    courseController.updateCourseCommission)


router.get("/commission",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getCourseCommissions)


module.exports = router;