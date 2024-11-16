const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    creatorShare: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});


const Commission = mongoose.model('commissionSchema', commissionSchema);
module.exports = { Commission };