const mongoose = require('mongoose');

const newsLetterSubscriber = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const newsSubscriber = mongoose.model('NewsLetterSubcriber', newsLetterSubscriber);

module.exports = newsSubscriber;