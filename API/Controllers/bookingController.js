// Booking model import
const { default: mongoose } = require("mongoose");
const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");
const User = require("../Models/userModels");

// Function to handle new booking creation
const createBooking = async (req, res) => {
  try {
    const { carid, date, status } = req.body;

    if (!carid || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      userid: req.session.user._id,
      carid,
      date: new Date(date),
      status,
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// Function to handle booking updates
const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
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
    const userId = req.session.user._id;

    // Find all cars listed by the logged-in user
    const userCars = await Car.find({ owner: userId });

    // Extract car IDs from the user's cars
    const carIds = userCars.map((car) => car._id);

    // Find all bookings where the car ID matches any of the user's cars
    const bookings = await Booking.find({ carid: { $in: carIds } })
      .populate({
        path: "userid",
        select: "-password",
        model: User,
        as: "user",
      }) // Populate 'userid' with user details
      .populate({ path: "carid", model: Car, as: "car" }); // Populate 'carid' with car details

    // Return the bookings as a response
    res.status(200).json(bookings);
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

    const booking = await Booking.findOne({ carid: bookingId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res.status(500).json({ message: "Error fetching booking by ID" });
  }
};

// Function to get a specific car bookings
const getCarBookings = async (req, res) => {
  try {
    const carId = req.params.id;

    const bookings = await Booking.find({ carid: carId })
      .populate({
        path: "userid",
        select: "username _id",
      })
      .exec();

    const updatedBookings = bookings.map((booking) => {
      const { userid, ...rest } = booking.toObject();
      return {
        ...rest,
        user: userid,
      };
    });

    return res.status(200).json(updatedBookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching booking by carId" });
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getCarBookings,
};
