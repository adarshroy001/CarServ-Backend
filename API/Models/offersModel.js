const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    termsConditions: {
        type: String,
    },
    cuponCode: {
        type: String,
    },
    otherDetails: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const offersModel = mongoose.model('Offer', offerSchema);

module.exports = offersModel;
