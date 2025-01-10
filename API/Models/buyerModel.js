const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "First Name and Surname is required."],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address1: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
    },
    address2: {
      type: String,
      required: [true, "Address2 is required."],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
    },
    postcode: {
      type: String,
      required: [true, "Postcode is required."],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required."],
    },
    carId: {
      type: mongoose.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: [true, "Status is required."],
    },
    paymentStatus: {
      type: String,
      required: [true, "Payment status is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Buyer", buyerSchema);
