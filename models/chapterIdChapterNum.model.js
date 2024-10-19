const mongoose = require("mongoose");

const chapterIdChapterNumSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chapter',
    },
    chapterNumber: {
        type: Number,
        required: true,
    },      
}, {
    timestamps: true,
});


const ChapterIdChapterNum = mongoose.model('ChapterIdChapterNum', chapterIdChapterNumSchema);
module.exports = { ChapterIdChapterNum };