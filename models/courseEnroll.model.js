const mongoose = require("mongoose");


const courseEnroll = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    learnerIds: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
}, {
    timestamps: true,
});


const CourseEnroll = mongoose.model('CourseEnroll', courseEnroll);
module.exports = { CourseEnroll };