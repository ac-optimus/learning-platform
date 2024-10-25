const mongoose = require("mongoose");
const QuestionType = require('../enums/questiontype');

const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    quizId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Quiz',
    },
    questionType: {
        type: String,
        enum: Object.values(QuestionType),
        required: true
    },
    solution: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamps: true,
});


const Question = mongoose.model('Question', questionSchema);
module.exports = { Question };