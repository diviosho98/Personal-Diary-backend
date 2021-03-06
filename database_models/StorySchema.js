const mongoose = require('mongoose');
const { Schema } = mongoose;

const StorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true }
);

module.exports = mongoose.model('story',StorySchema);