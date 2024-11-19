const httpStatus = require("http-status");
const { CourseEnroll } = require("../models");
const ApiError = require("../utils/ApiError");
const courseEnrollService = require("../services/courseEnroll.service");


const createEnrollmentForCourse = async (courseId, learnerIds) => {
    const newEnrollment = new CourseEnroll({
        courseId: courseId,
        learnerIds: learnerIds
    });
    return await newEnrollment.save();
}

const enrollLearnerToCourse = async (courseId, learnerId) => {
    const existingEnrolls = await CourseEnroll.findOne({ courseId: courseId });
    if (!existingEnrolls) {
        let enrollment = await createEnrollmentForCourse(courseId, [learnerId])
        if (!enrollment) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Can not create enrollment object')
        }
    } else if (!existingEnrolls.learnerIds.includes(learnerId)) {
        existingEnrolls.learnerIds.push(learnerId);
        await existingEnrolls.save();
    } else 
        throw new ApiError(httpStatus.OK, "User already enrolled")
    return learnerId;
}

const getEnrolledLearnerForCourse = async (courseId) => {
    return await CourseEnroll.findOne({ courseId: courseId });
}

const deleteCourseEnrollment = async (courseId) => {
    const enrollment = await CourseEnroll.findOne({ courseId: courseId });
    if (enrollment) {
        await CourseEnroll.deleteOne({ _id: enrollment._id });
    }
    return enrollment;
}

const unenrollLearnerToCourse = async (courseId, learnerId) => {
    const enrollment = await CourseEnroll.findOne({ courseId: courseId });
    if (enrollment) {
        const index = enrollment.learnerIds.indexOf(learnerId);
        if (index > -1) {
            enrollment.learnerIds.splice(index, 1);
            await enrollment.save();
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, "User not already enrolled to the course");
        }
    }
    return enrollment;
}

const getEnrolledCoursesForLearner = async (learnerId) => {
    const courses = await CourseEnroll.find({ learnerIds: learnerId }).populate('courseId').select('courseId -_id');
    return courses.map(enrollment => enrollment.courseId);
}


module.exports = {
    createEnrollmentForCourse,
    enrollLearnerToCourse,
    getEnrolledLearnerForCourse,
    unenrollLearnerToCourse,
    deleteCourseEnrollment,
    getEnrolledCoursesForLearner
}