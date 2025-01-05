const mongoose = require('mongoose');

const buyCarSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
  },
  dateOfBirth: {
    type: Date, // Optional field
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
    trim: true,
  },
  postcode: {
    type: String,
    required: [true, 'Postcode is required.'],
    trim: true,
  },
  images: {
    type: [String], 
    required: [true, 'At least one image is required.'],
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('BuyCar', buyCarSchema);
