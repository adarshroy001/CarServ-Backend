const mongoose = require('mongoose');

const pageLogsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    pageUrl: {
        type: String,
    },
    message: {
        type: String,
    },
    metricName: { 
        type: String 
    },
    metricValue: { 
        type: Number 
    },
    properties: {
        type: Object,
        default: {} 
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const PageLog = mongoose.model('PageLog', pageLogsSchema);

module.exports = PageLog;