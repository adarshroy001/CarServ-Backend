const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  carid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
