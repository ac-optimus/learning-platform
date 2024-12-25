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
 *     description: Requires 'creator' role
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
 *         - category
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         shortBio:
 *           type: string
 *         imageUrl:
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
 *         quizIds:
 *           type: array
 *           items:
 *             type: string
 *         contentOrder:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *         category:
 *           type: string
 *           enum: [ "TECHNOLOGY", "BUSINESS", "FINANCE", "ARTS", "HEALTH", "OTHER" ]
 *         isFree:
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
 *     description: Requires 'creator' role
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
 *         imageUrl:
 *           type: string
 *           required: false
 *         creator:
 *           type: string
 *           required: false
 *         tags:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         price:
 *           type: number
 *           required: false
 *         chapterIds:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         quizIds:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         contentOrder:
 *           type: array
 *           required: false
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *           required: false
 *         category:
 *           type: string
 *           required: false
 *           enum: [SOFTWARE, ELECTRICAL, MATERIALS_SCIENCE, NETWORKING, OTHER]
 *         isFree:
 *           type: boolean
 *           required: false
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
 *         imageUrl:
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
 *         quizIds:
 *           type: array
 *           items:
 *             type: string
 *         contentOrder:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *         category:
 *           type: string
 *           enum: [SOFTWARE, ELECTRICAL, MATERIALS_SCIENCE, NETWORKING, OTHER]
 *         isFree:
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
 *     description: Requires 'creator' role
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
 *     description: No Auth
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
 *     description: No Auth 'search' role
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
 *     description: Required role 'creator'
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

/**
 * @swagger
 * /courses/categoryAndTags:
 *   get:
 *     summary: Retrieve categories and tags
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: No Auth
 *     responses:
 *       200:
 *         description: Successful retrieval of categories and tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 others:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "web"
 *                 ELECTRICAL:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Algorithm"
 *                 MATERIALS_SCIENCE:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "MS"
 *                 NETWORKING:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "mern"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/categoryAndTags",
    requiredRoles('search'),
    requetsBodyLog,
    courseController.categoryAndTags)

/**
 * @swagger
 * /courses/allCourses:
 *   get:
 *     summary: Retrieve details of a specific course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Required 'admin' role
 *     responses:
 *       200:
 *         description: Successful retrieval of course details
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
 */
router.get("/allCourses",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getAllCourses)

/**
 * @swagger
 * /courses/allCourses:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
 *     responses:
 *       200:
 *         description: Successful retrieval of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/allCourseIds",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getAllCourseIds)
/**
 * @swagger
 * /courses/commission:
 *   post:
 *     summary: Set a course commission
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - creatorShare
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: "The unique identifier of the course"
 *               creatorShare:
 *                 type: number
 *                 description: "Percentage of the course revenue allocated to the creator"
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Successfully set course commission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseCommission'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
 */

router.post("/commission",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.setCourseCommission),
    courseController.setCourseCommission)

/**
 * @swagger
 * /courses/commission:
 *   get:
 *     summary: Retrieve all course commissions
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
 *     responses:
 *       200:
 *         description: Successful retrieval of course commissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseCommission'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/commission/:courseId",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.deleteCourseCommission),
    courseController.deleteCourseCommission)

/**
 * @swagger
 * /courses/commission/{courseId}:
 *   put:
 *     summary: Update a course commission
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
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
 *             type: object
 *             required:
 *               - creatorShare
 *             properties:
 *               creatorShare:
 *                 type: number
 *                 description: "Percentage of the course revenue allocated to the creator"
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Successfully updated course commission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseCommission'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No commission found for this course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No commission found for this course"
 */
router.put("/commission/:courseId",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    validate(courseValidation.updateCourseCommission),
    courseController.updateCourseCommission)


/**
 * @swagger
 * /courses/commission:
 *   get:
 *     summary: Retrieve all course commissions
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
 *     responses:
 *       200:
 *         description: Successful retrieval of all course commissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseCommission'
 *               example:
 *                 - _id: "67374172c8dfff33afeaa692"
 *                   courseId: "673089b4081c6e275282d180"
 *                   creatorId: "66fe365763d7450003e4ef5e"
 *                   creatorShare: 60
 *                   createdAt: "2024-11-15T12:41:22.521Z"
 *                   updatedAt: "2024-11-25T12:27:07.974Z"
 *                   __v: 0
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/commission",
    requiredRoles('admin'),
    auth,
    requetsBodyLog,
    courseController.getCourseCommissions)


module.exports = router;