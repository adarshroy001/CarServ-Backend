const express = require("express");
const router = express.Router();

const bookingController = require("../Controllers/bookingController.js");
const isAuthenticated = require("../middlewares/authentication.js");

// Create a new booking
router.post("/create", isAuthenticated, bookingController.createBooking);

// Update booking details
router.put("/edit/:id", bookingController.updateBooking);

// Delete booking by id
router.delete("/delete/:id", bookingController.deleteBooking);

// Get all bookings
router.get("/getAll", isAuthenticated, bookingController.getAllBookings);

router.get("/getBooking/:id", bookingController.getBookingById);

// Get a specific car bookings
router.get("/:id", bookingController.getCarBookings);

module.exports = router;
