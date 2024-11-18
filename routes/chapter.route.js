const express = require("express");
const validate = require("../middlewares/validate");
const chapterValidation = require("../validations/chapter.validation");
const { auth } = require("../middlewares/auth");
const chapterController = require("../controllers/chapter.controller");
const requiredRoles = require("../middlewares/req.roles");
const router = express.Router();


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         chapterNumber:
 *           type: number
 *         isFree:
 *           type: boolean
 *         isPublished:
 *           type: boolean
 *         courseId:
 *           type: string
 *         creatorId:
 *           type: string
 *     ChapterRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - chapterNumber
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         chapterNumber:
 *           type: number
 *         isFree:
 *           type: boolean
 *         isPublished:
 *           type: boolean
 * 
 * /chapters/{courseId}:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
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
 *             $ref: '#/components/schemas/ChapterRequest'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: Get all chapters for a course
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                 chapters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 * 
 * /chapters/{courseId}/{chapterId}:
 *   put:
 *     summary: Update a chapter
 *     tags: [Chapters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chapter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChapterRequest'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a chapter
 *     tags: [Chapters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chapter ID
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get a chapter by ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chapter ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.post("/:courseId",
    requiredRoles('create'),
    auth,
    requetsBodyLog,
    validate(chapterValidation.chapterCreate),
    chapterController.create)

router.put("/:courseId/:chapterId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(chapterValidation.chapterUpdate),
    chapterController.update)

router.delete("/:courseId/:chapterId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(chapterValidation.chapterDelete),
    chapterController.deleteChapter)


router.get("/:courseId",
    requiredRoles('learnerNcreator'),
    auth,
    requetsBodyLog,
    validate(chapterValidation.chapterGetByCourseId),
    chapterController.getChaptersByCourseId)

router.get("/:courseId/:chapterId",
    requiredRoles('learnerNcreator'),
    auth,
    requetsBodyLog,
    validate(chapterValidation.chapterGetById),
    chapterController.getChapterById)


module.exports = router;