const mongoose = require('mongoose')
const { Schema } = mongoose;

const submissionSchema = new mongoose.Schema({
    questionIds: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    },
    answer: {
        type: Schema.Types.Mixed,
        required: true
    },
    learnerId: {
        type: mongoose.Schema.Types.ObjectId
    }
})


const Submission = mongoose.model('Submission', submissionSchema);
module.exports = { Submission };