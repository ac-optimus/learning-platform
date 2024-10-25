const mongoose = require('mongoose')


const submissionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    submissions: {
        type: [{
            questionIds: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Question',
                required: true
            },
            answer: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { 
    timestamps: true 
});


const Submission = mongoose.model('Submission', submissionSchema);
module.exports = { Submission };