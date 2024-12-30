const mongoose = require('mongoose');
const expireTime = process.env.EMAIL_OTP_EXPIRE_TIME || 300;

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
        expires: expireTime // OTP will expire after 5 minutes
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;