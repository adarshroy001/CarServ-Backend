const express = require("express");
const router = express.Router();

const bookingController = require("../Controllers/bookingController.js");

// Create a new booking
router.post("/create", bookingController.createBooking);

// Update booking details
router.put("/edit/:id", bookingController.updateBooking);

// Delete booking by id
router.delete("/delete/:id", bookingController.deleteBooking);

// Get all bookings
router.get("/getAll", bookingController.getAllBookings);


router.get("/getBooking/:id", bookingController.getBookingById);

module.exports = router;
