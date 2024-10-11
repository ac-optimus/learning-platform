const express = require("express");
const validate = require("../middlewares/validate");
const courseValidation = require("../validations/course.validation");
const auth = require("../middlewares/auth");
const courseController = require("../controllers/course.controller");
const requiredRoles = require("../middlewares/req.roles");
const router = express.Router();


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}

router.post("/",
    requiredRoles('create'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseCreate),
    courseController.create)

router.put("/",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseUpdate),
    courseController.update)

router.delete("/:courseId",
    requiredRoles('update'),
    auth,
    requetsBodyLog,
    validate(courseValidation.courseDelete),
    courseController.deleteCourse)

router.get("/search",
    requiredRoles('search'),
    requetsBodyLog,
    courseController.search)


router.get("/search/:courseId",
    requiredRoles('search'),
    requetsBodyLog,
    validate(courseValidation.getCourse),
    courseController.searchCourseById)


module.exports = router;