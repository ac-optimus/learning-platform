const express = require("express");
const courseRoute = require("./course.route");
const uploadRoute = require("./route.upload");
const router = express.Router();


router.use("/course", courseRoute);
router.use("/image", uploadRoute);


module.exports = router;