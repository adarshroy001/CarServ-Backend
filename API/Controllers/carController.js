const Car = require("../Models/carModel");
const User = require("../Models/userModels");
const { getStaticFilePath, getLocalPath } = require("../utils/helpers");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");

const createCar = async (req, res) => {
  try {
    const first = req.body;
    console.log("kk", first);

    // Validate required fields
    if (!first.name || !first.askingPrice || !first.year) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Process image URLs
    const imageUrls = (req.files?.firstPageImages || []).map(
      (file) => `/images/${file.filename}`
    );

    // Prepare car data
    const carData = {
      name: first.name,
      askingPrice: Number(first.askingPrice),
      year: Number(first.year),
      status: first.status,
      condition: first.condition,
      transmission: first.transmission,
      fuel: first.fuelType,
      color: first.color,
      mileage: Number(first.mileage),
      engineSize: Number(first.engineSize),
      gearbox: first.gearbox,
      owners: Number(first.owners),
      serviceHistory: first.serviceHistory,
      bodyType: first.bodyType,
      seats: Number(first.seats),
      doors: Number(first.doors),
      numberPlate: first.numberPlate,
      email: first.email,
      phone: first.phone,
      postcode: first.postcode,
      phoneCommunication: first.phoneCommunication === "true",
      emailCommunication: first.emailCommunication === "true",
      agreeToInspection: first.agreeToInspection === "true",
      dateOfRegistration: first.dateOfRegistration,
      images: imageUrls,
      datePosted: first.datePosted || new Date(),
      owner: req.session?.user?._id,
    };

    // Save to the database
    const newCar = new Car(carData);
    const savedCar = await newCar.save();

    // Respond with saved car data
    res.status(201).json({
      status: "success",
      data: { car: savedCar.toObject() },
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCarDetails = async (req, res) => {
  try {
    const first = req.body;
    const first1 = req.files;
    console.log("i", first);

    // Validate required fields
    if (!first.name || !first.askingPrice || !first.year) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Process image URLs
    const imageUrls = (req.files?.firstPageImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const imageUrls1 = (req.files?.detailsImages || []).map(
      (file) => `/images/${file.filename}`
    );

    // Prepare car data
    const carData = {
      name: first.name,
      askingPrice: Number(first.askingPrice),
      year: Number(first.year),
      status: first.status,
      condition: first.condition,
      transmission: first.transmission,
      fuel: first.fuelType,
      color: first.color,
      mileage: Number(first.mileage),
      engineSize: Number(first.engineSize),
      gearbox: first.gearbox,
      owners: Number(first.owners),
      serviceHistory: first.serviceHistory,
      bodyType: first.bodyType,
      seats: Number(first.seats),
      doors: Number(first.doors),
      numberPlate: first.numberPlate,
      email: first.email,
      phone: first.phone,
      postcode: first.postcode,
      phoneCommunication: first.phoneCommunication === "true",
      emailCommunication: first.emailCommunication === "true",
      agreeToInspection: first.agreeToInspection === "true",
      dateOfRegistration: first.dateOfRegistration,
      images: imageUrls,
      datePosted: first.datePosted || new Date(),
      owner: req.session?.user?._id,
    };

    const parsedFeatures = JSON.parse(first.features);
    const DetailsData = {
      features: parsedFeatures,
      knownIssues: first.knownIssues,
      majorRepairs: first.majorRepairs,
      images: imageUrls1,
    };

    const combinedData = {
      ...carData,
      details: DetailsData,
    };
    // Save to the database
    const newCar = new Car(combinedData);
    const savedCar = await newCar.save();

    // Respond with saved car data
    res.status(201).json({
      status: "success",
      data: { car: savedCar.toObject() },
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCarCertify = async (req, res) => {
  try {
    const first = req.body;
    const first1 = req.files;
    // console.log("i",first1)
    console.log("i111", first1);

    // Validate required fields
    if (!first.name || !first.askingPrice || !first.year) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Process image URLs
    const imageUrls = (req.files?.firstPageImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const imageUrls1 = (req.files?.detailsImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const carImages = (req.files?.carImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const serviceRecords = (req.files?.serviceRecords || []).map(
      (file) => `/doc/${file.filename}`
    );
    const logbook = (req.files?.logbook || []).map(
      (file) => `/images/${file.filename}`
    );
    const identy = (req.files?.identy || []).map(
      (file) => `/images/${file.filename}`
    );

    // Prepare car data
    const carData = {
      name: first.name,
      askingPrice: Number(first.askingPrice),
      year: Number(first.year),
      status: first.status,
      condition: first.condition,
      transmission: first.transmission,
      fuel: first.fuelType,
      color: first.color,
      mileage: Number(first.mileage),
      engineSize: Number(first.engineSize),
      gearbox: first.gearbox,
      owners: Number(first.owners),
      serviceHistory: first.serviceHistory,
      bodyType: first.bodyType,
      seats: Number(first.seats),
      doors: Number(first.doors),
      numberPlate: first.numberPlate,
      email: first.email,
      phone: first.phone,
      postcode: first.postcode,
      phoneCommunication: first.phoneCommunication === "true",
      emailCommunication: first.emailCommunication === "true",
      agreeToInspection: first.agreeToInspection === "true",
      dateOfRegistration: first.dateOfRegistration,
      images: imageUrls,
      datePosted: first.datePosted || new Date(),
      owner: req.session?.user?._id,
    };

    const parsedFeatures = JSON.parse(first.features);
    const DetailsData = {
      features: parsedFeatures,
      knownIssues: first.knownIssues,
      majorRepairs: first.majorRepairs,
      images: imageUrls1,
    };
    const certifyData = {
      agreeToTermsPay: first.agreeToTermsPay === "true",
      agreeToTermsReturn: first.agreeToTermsReturn === "true",
      agreeToTermsWebsite: first.agreeToTermsWebsite === "true",
      bankName: first.bankName,
      sortCode: first.sortCode,
      accountNumber: first.accountNumber,
      fullName: first.fullName,
      valuation: first.valuation,
      fullAddress: first.fullAddress,
      carImages: carImages,
      serviceRecords: serviceRecords,
      logbook: logbook,
      identification: identy,
      dateOfBirth: new Date(first.dateOfBirth),
    };

    const combinedData = {
      ...carData,
      details: DetailsData,
      certify: certifyData,
    };
    // Save to the database
    const newCar = new Car(combinedData);
    const savedCar = await newCar.save();

    // Respond with saved car data
    res.status(201).json({
      status: "success",
      data: { car: savedCar.toObject() },
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCarAdvertise = async (req, res) => {
  try {
    const first = req.body;
    const first1 = req.files;
    // console.log("i",first1)
    console.log("i111", first1);

    // Validate required fields
    if (!first.name || !first.askingPrice || !first.year) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Process image URLs
    const imageUrls = (req.files?.firstPageImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const imageUrls1 = (req.files?.detailsImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const carImages = (req.files?.carImages || []).map(
      (file) => `/images/${file.filename}`
    );
    const serviceRecords = (req.files?.serviceRecords || []).map(
      (file) => `/doc/${file.filename}`
    );
    const logbook = (req.files?.logbook || []).map(
      (file) => `/images/${file.filename}`
    );
    const identy = (req.files?.identy || []).map(
      (file) => `/images/${file.filename}`
    );

    // Prepare car data
    const carData = {
      name: first.name,
      askingPrice: Number(first.askingPrice),
      year: Number(first.year),
      status: first.status,
      condition: first.condition,
      transmission: first.transmission,
      fuel: first.fuelType,
      color: first.color,
      mileage: Number(first.mileage),
      engineSize: Number(first.engineSize),
      gearbox: first.gearbox,
      owners: Number(first.owners),
      serviceHistory: first.serviceHistory,
      bodyType: first.bodyType,
      seats: Number(first.seats),
      doors: Number(first.doors),
      numberPlate: first.numberPlate,
      email: first.email,
      phone: first.phone,
      postcode: first.postcode,
      phoneCommunication: first.phoneCommunication === "true",
      emailCommunication: first.emailCommunication === "true",
      agreeToInspection: first.agreeToInspection === "true",
      dateOfRegistration: first.dateOfRegistration,
      images: imageUrls,
      datePosted: first.datePosted || new Date(),
      owner: req.session?.user?._id,
    };

    const parsedFeatures = JSON.parse(first.features);
    const DetailsData = {
      features: parsedFeatures,
      knownIssues: first.knownIssues,
      majorRepairs: first.majorRepairs,
      images: imageUrls1,
    };
    const certifyData = {
      agreeToTermsPay: first.agreeToTermsPay === "true",
      agreeToTermsReturn: first.agreeToTermsReturn === "true",
      agreeToTermsWebsite: first.agreeToTermsWebsite === "true",
      bankName: first.bankName,
      sortCode: first.sortCode,
      accountNumber: first.accountNumber,
      fullName: first.fullName,
      valuation: first.valuation,
      fullAddress: first.fullAddress,
      carImages: carImages,
      serviceRecords: serviceRecords,
      logbook: logbook,
      identification: identy,
      dateOfBirth: new Date(first.dateOfBirth),
    };

    // payment
    const paymentData = {
      amount: Number(first.amount),
      agreeToTerms: first.agreeToTermsPayment === "true",
    };

    const combinedData = {
      ...carData,
      details: DetailsData,
      certify: certifyData,
      payment: paymentData,
    };
    // Save to the database
    const newCar = new Car(combinedData);
    const savedCar = await newCar.save();

    // Respond with saved car data
    res.status(201).json({
      status: "success",
      data: { car: savedCar.toObject() },
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to update car details
const updateCar = async (req, res) => {
  try {
    console.log(req.body, req.files);
    const carId = req.params.id;
    // Extracting car details from the request body
    const {
      name,
      price,
      year,
      description,
      datePosted,
      location,
      status,
      condition,
      transmission,
      fuel,
      color,
      mileage,
      bodyType,
      engine,
      VIN,
      exterior,
      interior,
      safety,
      removedImages,
      numberPlate,
      askingPrice,
      email,
      phone,
      postcode,
      phoneCommunication,
      emailCommunication,
      engineSize,
      gearbox,
      owners,
      serviceHistory,
      seats,
      doors,
      agreeToInspection,
      dateOfRegistration,
      //Certify

      agreeTo,
      agreeToTerms1,
      bankName,
      sortCode,
      accountNumber,
      fullName,
      fullAddress,
      dateOfBirth,
      images,
      serviceRecords,
      images2,
      images3,
      valuation,
      agreeToTerms2,
      agreeToTerms3,
      agreeToTerms4,
      agreeToTerms5,

      // /payment
      amount,
      agreeToTerms,
    } = req.body;

    console.log(
      agreeTo,
      bankName,
      sortCode,
      accountNumber,
      fullName,
      fullAddress,
      dateOfBirth,
      images,
      serviceRecords,
      images2,
      images3,
      valuation,
      agreeToTerms2,
      agreeToTerms3,
      agreeToTerms4,
      agreeToTerms5,
      amount,
      agreeToTerms
    );

    if (
      !name ||
      !price ||
      !year ||
      !datePosted ||
      !location ||
      !status ||
      !condition ||
      !transmission ||
      !fuel ||
      !color ||
      !mileage ||
      !bodyType ||
      !engine ||
      !VIN ||
      !exterior ||
      !interior ||
      !safety ||
      !numberPlate ||
      !email ||
      !phone ||
      !postcode ||
      !phoneCommunication ||
      !emailCommunication ||
      !engineSize ||
      !gearbox ||
      !owners ||
      !serviceHistory ||
      !seats ||
      !doors ||
      !agreeToInspection ||
      !dateOfRegistration ||
      // Certify Conditions
      !agreeTo ||
      !agreeToTerms1 ||
      !bankName ||
      !sortCode ||
      !accountNumber ||
      !fullName ||
      !fullAddress ||
      !dateOfBirth ||
      !images ||
      !serviceRecords ||
      !images2 ||
      !images3 ||
      !valuation ||
      !agreeToTerms2 ||
      !agreeToTerms3 ||
      !agreeToTerms4 ||
      !agreeToTerms5 ||
      // Payment Conditions
      !amount ||
      !agreeToTerms
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exteriorArray = JSON.parse(exterior);
    const interiorArray = JSON.parse(interior);
    const safetyArray = JSON.parse(safety);
    const locationObj = JSON.parse(location);
    const datePostedDate = new Date(datePosted);
    const removedImagesArray = JSON.parse(removedImages);

    if (
      !locationObj ||
      (!exteriorArray && !exteriorArray.length) ||
      (!interiorArray && !interiorArray.length) ||
      (!safetyArray && !safetyArray.length)
    ) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const remainingImages = car.images.filter(
      (image) => !removedImagesArray.includes(image.localPath)
    );

    for (const localPath of removedImagesArray) {
      const imageToRemove = car.images.find(
        (image) => image.localPath === localPath
      );
      if (imageToRemove && imageToRemove.localPath) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          imageToRemove.localPath
        );
        fs.unlink(filePath, (err) => {
          if (err) console.log("Error while removing local files: ", err);
          else {
            console.log("Removed local: ", localPath);
          }
        });
      }
    }

    const newImages =
      req.files && req.files.length
        ? req.files.map((image) => {
            const imageUrl = getStaticFilePath(req, image.filename);
            const imageLocalPath = getLocalPath(image.filename);
            return { url: imageUrl, localPath: imageLocalPath };
          })
        : [];

    // Updating the car object with details and images
    car.images = [...remainingImages, ...newImages];
    car.name = name;
    car.price = price;
    car.year = year;
    car.datePosted = datePostedDate;
    car.location = locationObj;
    car.status = status;
    car.condition = condition;
    car.transmission = transmission;
    car.fuel = fuel;
    car.color = color;
    car.mileage = mileage;
    car.bodyType = bodyType;
    car.engine = engine;
    car.VIN = VIN;
    car.exterior = exteriorArray;
    car.interior = interiorArray;
    car.safety = safetyArray;
    car.numberPlate = numberPlate;
    car.askingPrice = askingPrice;
    car.email = email;
    car.phone = phone;
    car.postcode = postcode;
    car.phoneCommunication = phoneCommunication;
    car.emailCommunication = emailCommunication;
    car.engineSize = engineSize;
    car.gearbox = gearbox;
    car.owners = owners;
    car.serviceHistory = serviceHistory;
    car.seats = seats;
    car.doors = doors;
    car.agreeToInspection = agreeToInspection;
    car.dateOfRegistration = new Date(dateOfRegistration);

    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({ message: "Error updating car details" });
  }
};

// Controller function to delete car by id
const deleteCar = async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedCar = await Car.deleteOne({ _id: req.params.id }); // Corrected to _id

    if (deletedCar.deletedCount === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).send({ message: `Successfully deleted ${req.params.id}` }); // 204 No Content indicates successful deletion
  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ message: "Error in car deletion" });
  }
};

// Function for retrieving a list of all cars
const getAllCars = async (req, res) => {
  try {
    const carList = await Car.find({});
    // console.log(
    //   "Retrieved cars:",
    //   // carList.map((car) => ({
    //   //   id: car._id,
    //   //   // name: car.name,
    //   //   // imageCount: car.images.length,
    //   // }))
    // );
    console.log("Cars data being sent:", carList); // Added log
    res.status(200).json(carList);
  } catch (error) {
    console.error("Get All Cars Error:", error);
    res.status(500).json({ message: "Error retrieving cars" });
  }
};

// Function to retrieve latest cars
const getLatest = async (req, res) => {
  try {
    const latestCars = await Car.find({}).sort({ datePosted: -1 }).limit(4);
    res.status(200).json(latestCars);
  } catch (error) {
    console.error("Get Latest Cars Error:", error);
    res.status(500).json({ message: "Error retrieving latest cars" });
  }
};

const getMakes = async (req, res) => {
  try {
    const cars = await Car.find({}, "name");

    const makes = [...new Set(cars.map((car) => car.name.split(" ")[0]))];

    res.status(200).json(makes);
  } catch (error) {
    console.error("Get Makes Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching makes", error: error.toString() });
  }
};

const getModels = async (req, res) => {
  try {
    const { make } = req.query;
    const cars = await Car.find({ name: new RegExp("^" + make, "i") }, "name");
    const models = cars.map((car) => {
      const nameParts = car.name.split(" ");
      return nameParts.slice(1).join(" ");
    });
    res.status(200).json([...new Set(models)]);
  } catch (error) {
    console.error("Get Models Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching models", error: error.toString() });
  }
};

const getCarCount = async (req, res) => {
  try {
    const filter = { ...req.query };

    // Handle year range
    if (filter.year) {
      const { from, to } = filter.year;
      if (from) filter.year = { $gte: parseInt(from) };
      if (to) filter.year = { ...filter.year, $lte: parseInt(to) };
      if (!from && !to) delete filter.year;
    }

    const count = await Car.countDocuments(filter);
    res.status(200).json(count);
  } catch (error) {
    console.error("Get Car Count Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching car count", error: error.toString() });
  }
};

const getCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error("Get Car Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching car", error: error.toString() });
  }
};

const getVehicleDataByVRN = async (req, res) => {
  try {
    const apiKey = process.env.UK_VEHICLE_API_KEY;
    const vrn = req.params.vrn.replace(/\s/g, "").toUpperCase();
    const apiUrl = `${process.env.UK_VEHICLE_API_URL}?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${vrn}`;

    const response = await axios.get(apiUrl);

    if (response.data.Response.StatusCode === "Success") {
      const vehicleData = response.data.Response.DataItems;
      res.json(vehicleData);
    } else {
      console.error("UK Vehicle Data API Error:", response.data.Response);

      if (response.status === 401) {
        return res.status(401).json({
          error: "Invalid or expired API key. Please contact support.",
        });
      } else if (response.status === 404) {
        return res.status(404).json({ error: "Vehicle not found." });
      } else {
        return res.status(500).json({ error: "API request failed." });
      }
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    if (error.response && error.response.status === 401) {
      return res
        .status(401)
        .json({ error: "Invalid or expired API key. Please contact support." });
    }
    res.status(500).json({ error: "Error fetching vehicle data." });
  }
};

const softDelListing = async (req, res) => {
  try {
    const atListingID = req.params.id;
    const updateListing = await Car.findByIdAndUpdate(
      atListingID,
      { isDeleted: true },
      { new: true }
    );

    if (!updateListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res
      .status(200)
      .json({ message: "Listing soft-deleted successfully", updateListing });
  } catch (error) {
    console.error("Error soft-deleting listing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getList = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch the list of cars
    const carList = await Car.find({});
    console.log("Cars data being sent:", carList); // Added log

    // Send the list of cars to the client
    res.status(200).json(carList);
  } catch (error) {
    console.error("Get All Cars Error:", error);
    res.status(500).json({ message: "Error retrieving cars" });
  }
};

const getListing = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Retrieve the list of cars for the user
    const carList = await Car.find({
      owner: new mongoose.Types.ObjectId(userId),
    });

    // Check if the list is empty
    if (!carList.length) {
      return res.status(404).json({ message: "No cars found for this user." });
    }

    // Optionally format the data
    const formattedCars = carList.map((car) => ({
      id: car._id,
      name: car.name,
      askingPrice: car.askingPrice,
      year: car.year,
      isDeleted: car.isDeleted || false,
    }));

    // Respond with the formatted car data
    res.status(200).json(formattedCars);
  } catch (error) {
    console.error("Get All Cars Error:", error);
    res.status(500).json({ message: "An error occurred while fetching cars." });
  }
};


module.exports = {
  createCar,
  createCarDetails,
  createCarCertify,
  createCarAdvertise,
  updateCar,
  deleteCar,
  getAllCars,
  getLatest,
  getMakes,
  getModels,
  getCarCount,
  getCar,
  getVehicleDataByVRN,
  softDelListing,
  getList,
  getListing,
 
};
