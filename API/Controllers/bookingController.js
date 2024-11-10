// Booking model import
const Booking = require("../Models/bookingModel");

// Function to handle new booking creation
const createBooking = async (req, res) => {
  try {
    const bookingDetails = req.body;
    const booking = new Booking(bookingDetails);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// Function to handle booking updates
const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const bookingUpdates = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, bookingUpdates, { new: true });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error in updateBooking:", error);
    res.status(500).json({ message: "Error updating booking" });
  }
};

// Function to handle booking deletion
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    await Booking.findByIdAndRemove(bookingId);
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Error deleting booking" });
  }
};

// Function to retrieve all bookings
const getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find({});
    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Function to retrieve specific bookings
const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id; // Assuming 'id' is the parameter in your route
    console.log(bookingId);

    const booking = await Booking.findOne({carid: bookingId});

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res.status(500).json({ message: "Error fetching booking by ID" });
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
};
