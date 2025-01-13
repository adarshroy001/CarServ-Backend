const mongoose = require('mongoose');
const expireTime = process.env.API_APP_EMAIL_OTP_EXPIRE_TIME || 600;

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: expireTime // OTP will expire after 10 minutes
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;