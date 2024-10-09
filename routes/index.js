const express = require("express");
const courseRoute = require("./course.route");
const router = express.Router();

router.use("/course", courseRoute);

module.exports = router;