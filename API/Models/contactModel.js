const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema({
  helpType: {
    type: String,
    required: [true, "Help type is required"],
    enum: ["question", "support", "feedback"], // Allowed options for help type
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [2, "First name must be at least 2 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [2, "Last name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Basic email regex
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [10, "Message must be at least 10 characters"],
  },
  submittedAt: {
    type: Date,
    default: Date.now, // Automatically set the submission timestamp
  },
});

// Create and export the model
const ContactForm = mongoose.model("ContactUs", contactFormSchema);

module.exports = ContactForm;
