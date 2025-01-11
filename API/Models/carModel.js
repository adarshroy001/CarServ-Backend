const mongoose = require("mongoose");

// Define the Certify Sub-Model
const certifySchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  sortCode: { type: String, required: true },
  accountNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  allCar: {
    type: [String],
    required: true,
  },
  serviceRecords: { type: [String], required: false },
  cImages: { type: [String], required: false },
  CImages1: { type: [String], required: true },
  valuation: { type: String, required: true },
  agreeToTerms2: { type: Boolean, required: true },
  agreeToTerms3: { type: Boolean, required: true },
  agreeToTerms4: { type: Boolean, required: true },
  agreeToTerms5: { type: Boolean, required: true },
});

// Define the Payment Sub-Model
const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 100,
  },
  agreeToTerms: {
    type: Boolean,
    required: true,
  },
});

// Car Schema
const firstPageSchema = new mongoose.Schema({
  askingPrice: { type: Number, required: true },
  condition: { type: String, required: true },
  mileage: { type: Number, required: true },
  servicesHistory: { type: String, required: true },
  images: [{ type: String }],
  numberPlate: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  postcode: { type: String, required: true },
  phoneCommunication: Boolean,
  emailCommunication: Boolean,
  agreeToInspection: Boolean,
});

const detailsSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  datePosted: { type: Date, required: true },
  location: {
    city: String,
    state: String,
    country: String,
    zip: String,
    streetaddress: String,
  },
  status: { type: String, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  color: { type: String, required: true },
  mileage: { type: Number, required: true },
  bodyType: { type: String, required: true },
  engineSize: { type: String, required: true },
  gearbox: { type: String, required: true },
  owners: { type: Number, required: true },
  serviceHistory: { type: String, required: true },
  seats: { type: Number, required: true },
  doors: { type: Number, required: true },
  VIN: { type: String },
  exterior: [String],
  interior: [String],
  safety: [String],
  images: [{ type: String }],
  images1: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  soldTo: [Number],
  numberPlate: { type: String, required: true },

  agreeToInspection: Boolean,
  dateOfRegistration: Date,
  features: {
    EngineAndPerformance: [String],
    Safety: [String],
    ComfortAndConvenience: [String],
    ExteriorFeatures: [String],
    Other: [String],
  },
  runningCosts: {
    fuelEconomy: {
      urban: String,
      extraUrban: String,
      combined: String,
    },
    annualCosts: {
      co2Emissions: String,
      vedFirstYear: String,
      vedStandard: String,
    },
  },
  vehicleChecks: {
    stolen: Boolean,
    scrapped: Boolean,
    exported: Boolean,
    imported: Boolean,
  },
});

const carSchema = new mongoose.Schema({
  // Embed the sub-models
  firstPage: firstPageSchema,
  details: detailsSchema,
  certify: certifySchema,
  payment: paymentSchema,

  isDeleted: { type: Boolean, default: false },
});

// Middleware to log before saving a car
carSchema.pre("save", function (next) {
  console.log("Saving car with images:", this.firstPage.images);
  next();
});

// Create the Car model
const Car = mongoose.model("Car", carSchema);

module.exports = Car;
