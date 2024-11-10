const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },

  datePosted: {
    type: Date,
    required: true,
  },
  location: {
    city: String,
    state: String,
    country: String,
    zip: String,
    streetaddress: String,
  },
  status: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  bodyType: {
    type: String,
    required: true,
  },
  engine: {
    type: String,
    required: true,
  },
  VIN: {
    type: String,
    required: true,
  },
  exterior: [String],
  interior: [String],
  safety: [String],
  images: {
    type: [String],
    default: ['../images/car1.jpg', '../images/car2.jpg', '../images/car3.jpg'],
  },
  soldTo: [Number],
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
