
const mongoose = require("mongoose");

// Define the Certify Sub-Model
const certifySchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  sortCode: { type: String, required: true },
  accountNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  carImages: {
    type: [String],
    required: true,
  },
  serviceRecords: { type: [String], required: false },
  logbook: { type: [String], required: false },
  identification: { type: [String], required: true },
  valuation: { type: String, required: true },
  agreeToTermsPay: { type: Boolean, required: true },
  agreeToTermsReturn: { type: Boolean, required: true },
  agreeToTermsWebsite: { type: Boolean, required: true },
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

const detailsSchema = new mongoose.Schema({
  features: {
    EngineAndPerformance: [String],
    Safety: [String],
    Checks: [String],
    RunningCosts: [String],
    Safety: [String],
    ComfortAndConvenience: [String],
    ExteriorFeatures: [String],
    Other: [String],
  },
  images: [{ type: String }],
  knownIssues: { type: String },
  majorRepairs: [String]
});

// Car Schema
const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  askingPrice: { type: Number, required: true },
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
  condition: { type: String, required: true },
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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  soldTo: [Number],
  numberPlate: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  postcode: { type: String, required: true },
  phoneCommunication: Boolean,
  emailCommunication: Boolean,
  agreeToInspection: Boolean,
  dateOfRegistration: Date,
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
 
  shortDescription: { type: String, required: true},
  detailedDescription: { type: String, required: true },
  grade : {type: Number, require:true},

  isDeleted: { type: Boolean, default: false },

  // Embed the sub-models
  details: detailsSchema,
  certify: certifySchema,
  payment: paymentSchema,
});

// Middleware to log before saving a car
carSchema.pre("save", function (next) {
  console.log("Saving car with images:", this.images);
  next();
});

// Create the Car model
const Car = mongoose.model("Car", carSchema);

module.exports = Car;
