const mongoose = require("mongoose");
const CourseCategory = require('../enums/courseCategory');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    shortBio: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false
    },
    creator: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: false
    },
    price: {
        type: Number,
        required: true,
    },
    chapterIds: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Chapter',
            default: []
        }],
    quizIds: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Quiz',
            default: []
        }],
    contentOrder: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        default: []
    }],
    isPublished: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        enum: Object.values(CourseCategory),
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

courseSchema.pre('save', function(next) {
    this.tags = [...new Set(this.tags)];
    next();
});

courseSchema.pre('updateOne', function(next) {
    const update = this.getUpdate();
    update['$set'].tags = [...new Set(update['$set'].tags)]
    next();
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' })


const Course = mongoose.model('Course', courseSchema);
module.exports = { Course };