const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question',
        default: []
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
    },
}, {
    timestamps: true,
});


const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = { Quiz };