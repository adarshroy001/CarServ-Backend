const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  askingPrice: {
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
  engineSize: {
    type: String,
    required: true,
  },
  gearbox: {
    type: String,
    required: true,
  },
  owners: {
    type: Number,
    required: true,
  },
  serviceHistory: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  doors: {
    type: Number,
    required: true,
  },
  VIN: {
    type: String,
  },
  exterior: [String],
  interior: [String],
  safety: [String],
  images: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  soldTo: [Number],
  numberPlate: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  publishPhone: Boolean,
  publishEmail: Boolean,
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
  isDeleted: { type: Boolean, default: false },
});

carSchema.pre("save", function (next) {
  console.log("Saving car with images:", this.images);
  next();
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
