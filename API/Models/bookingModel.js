const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carid: {
    type: mongoose.Types.ObjectId,
    ref: "Car",
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

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
