const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: false,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    chapterIds: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Chapter' 
        }],
    isPublished: {
        type: Boolean,
        default: false,
    },
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