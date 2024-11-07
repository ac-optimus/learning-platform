const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const requiredRoles = require("../middlewares/req.roles");
const courseEnrollController = require('../controllers/courseEnroll.controller.js');
const courseEnrollValidation = require('../validations/courseEnroll.validation');


const requetsBodyLog = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
}

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