const express = require("express");
const courseRoute = require("./course.route");
const uploadRoute = require("./route.upload");
const chapterRoute = require("./chapter.route");
const quizRoute = require("./quiz.route");
const questionRoute = require("./question.route");
const courseEnrollRoute = require("./courseEnroll.route");
const router = express.Router();


router.use("/course", courseRoute);
router.use("/image", uploadRoute);
router.use("/chapter", chapterRoute);
router.use("/quiz", quizRoute);
router.use("/question", questionRoute);
router.use("/enroll", courseEnrollRoute);


module.exports = router;