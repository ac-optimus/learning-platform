const mongoose = require('mongoose');
const { questionType } = require('../validations/custom.validation');
const { Schema } = mongoose;


const solutionSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    },
    questionType: {
        type: String,
        enum: Object.values(questionType),
        required: true
    },
    solution: {
        type: Schema.Types.Mixed,
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
}, { 
    timestamps: true 
});


const Solution = mongoose.model('Solution', solutionSchema);
module.exports = { Solution };