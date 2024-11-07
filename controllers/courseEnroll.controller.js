const httpStatus = require("http-status");
const courseService = require("../services/course.service");
const  ApiError  = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const courseEnrollService = require("../services/courseEnroll.service");
const ObjectId = require('mongoose').Types.ObjectId;


const enrollLearner =  catchAsync(async (req, res) => {
    // todo validate paymentToken - middleware
    const {courseId} = req.params
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course || !course.isPublished) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Course not found");
    }
    const learnerId = req.user._id
    const courseEnroll = await courseEnrollService.enrollLearnerToCourse(courseId, learnerId);
    if (!courseEnroll)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can not enroll user")
    res.status(httpStatus.OK).send({'message': "User successfully enrolled to the course"})
});

const unenrollLearner = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const course = await courseService.getCourseByCourseId(courseId);
    if (!course) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Course not found");
    }
    const learnerId = new ObjectId(req.user._id);
    const updateResult = await courseEnrollService.unenrollLearnerToCourse(courseId, learnerId);
    if (!updateResult) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update course enrollment");
    }
    res.status(httpStatus.OK).send({"message":"User successfully unenrolled to the course"});
})

const learnerEnrolledCourses = catchAsync(async (req, res) => {
    const learnerId = req.user._id;
    const response = await courseEnrollService.getEnrolledCoursesForLearner(learnerId);
    res.status(httpStatus.OK).send(response);

})


module.exports = {
    enrollLearner,
    unenrollLearner,
    learnerEnrolledCourses
}