const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});


const Chapter = mongoose.model('Chapter', chapterSchema);
module.exports = { Chapter };