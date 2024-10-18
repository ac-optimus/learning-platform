const express = require("express");
const courseRoute = require("./course.route");
const uploadRoute = require("./route.upload");
const chapterRoute = require("./chapter.route");

const router = express.Router();


router.use("/course", courseRoute);
router.use("/image", uploadRoute);
router.use("/chapter", chapterRoute);


module.exports = router;