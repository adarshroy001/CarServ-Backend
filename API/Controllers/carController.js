const Car = require("../Models/carModel");
const User = require("../Models/userModels");
const { getStaticFilePath, getLocalPath } = require("../utils/helpers");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mongoose = require('mongoose');


const createCar = async (req, res) => {
  try {
    // Destructure the necessary fields from req.body
    const {
      // Car data
      numberPlate,
      mileage,
      askingPrice,
      email,
      phone,
      postcode,
      servicesHistory,
      shortDescription,
      detailedDescription,
      grade,
      agreeToTerms,
      condition,
      emailCommunication,
      phoneCommunication,
      images1,

      fuel,
      transmission,
      bodyType,
      engineSize,
      owners,
      serviceHistory,
      seats,
      doors,
      color,
      dateOfRegistration,
      name,
      // Certify data
      agreeToTerms1,
      agreeToTerms2,
      agreeToTerms3,
      agreeToTerms4,
      agreeToTerms5,
      bankName,
      sortCode,
      accountNumber,
      fullName,
      valuation,
      fullAddress,
      cImages,
      cImages1,
      cImages2,

      // Payment data
      amount,
      agreeToTerms: agreeToTermsPayment,
    } = req.body;

    // Required fields for validation
    // const requiredFields = {
    //   carData: ['name', 'askingPrice', 'year', 'location', 'status', 'condition',
    //             'transmission', 'fuel', 'color', 'mileage', 'bodyType',
    //             'engineSize', 'gearbox', 'owners', 'serviceHistory', 'seats',
    //             'doors', 'numberPlate', 'email', 'phone', 'postcode',
    //             'dateOfRegistration'],
    //   certifyData: ['agreeToTerms', 'agreeToTerms1', 'agreeToTerms2',
    //                 'agreeToTerms3', 'agreeToTerms4', 'agreeToTerms5',
    //                 'bankName', 'sortCode', 'accountNumber', 'fullName',
    //                 'valuation', 'fullAddress'],
    //   paymentData: ['amount', 'agreeToTermsPayment']
    // };

    // // Function to check for missing fields
    // const findMissingFields = (fields, data) => {
    //   return fields.filter(field => !data[field] && data[field] !== false);
    // };

    // // Check for missing fields
    // const missingCarData = findMissingFields(requiredFields.carData, req.body);
    // const missingCertifyData = findMissingFields(requiredFields.certifyData, req.body);
    // const missingPaymentData = findMissingFields(requiredFields.paymentData, req.body);

    // if (missingCarData.length || missingCertifyData.length || missingPaymentData.length) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: "Missing required fields",
    //     missingFields: {
    //       carData: missingCarData,
    //       certifyData: missingCertifyData,
    //       paymentData: missingPaymentData
    //     }
    //   });
    // }

    // Handle image uploads
    const imageUrls =
      req.files?.images1?.map((file) => `/images/${file.filename}`) || [];
    const cImagesUrls =
      req.files?.cImages?.map((file) => `/images/${file.filename}`) || [];
    const cImages1Urls =
      req.files?.cImages1?.map((file) => `/images/${file.filename}`) || [];
    const cImages2Urls =
      req.files?.cImages2?.map((file) => `/images/${file.filename}`) || [];

    // Car data
    // const carData = {
    //   name,
    //   // year: Number(year),
    //   location,
    //   status,
    //   transmission: fuel,
    //   fuel: bodyType,
    //   color,
    //   engineSize: Number(engineSize),
    //   gearbox: owners,
    //   owners: Number(owners),
    //   seats: Number(seats),
    //   doors: Number(doors),

    //   dateOfRegistration,
    //   datePosted: datePosted || new Date(),
    //   owner: req.session.user._id,
    // };

    const firstPage = {
      askingPrice: Number(askingPrice),
      condition,
      mileage: Number(mileage),
      serviceHistory,
      images: imageUrls,
      agreeToInspection: agreeToTerms === "true",
      phoneCommunication: phoneCommunication === "true",
      email: email,
      phone: phone,
      postcode: postcode,
      numberPlate,
      grade,
      detailedDescription,
      shortDescription,
      servicesHistory,
      emailCommunication: emailCommunication === "true",
    };

    // Certify data
    const certifyData = {
      agreeToTerms: agreeToTerms === "true",
      agreeToTerms1: agreeToTerms1 === "true",
      agreeToTerms2: agreeToTerms2 === "true",
      agreeToTerms3: agreeToTerms3 === "true",
      agreeToTerms4: agreeToTerms4 === "true",
      agreeToTerms5: agreeToTerms5 === "true",
      bankName,
      sortCode,
      accountNumber,
      fullName,
      valuation,
      fullAddress,
      images: cImagesUrls,
      images1: cImages1Urls,
      images2: cImages2Urls,
    };

    // Payment data
    const paymentData = {
      amount: Number(amount),
      agreeToTerms: agreeToTermsPayment === "true",
    };

    // Combine all data into one object
    const combinedData = {
      // ...carData,
      firstPage: firstPage,
      certify: certifyData,
      payment: paymentData,
    };

    // Save the combined data to the database
    const newCar = new Car(combinedData);
    const savedCar = await newCar.save();

    // Respond with the saved car data
    res.status(201).json({
      status: "success",
      data: { car: savedCar.toObject() },
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const createCarFirstPage = async (req, res) => {
  try {
    // Destructure the necessary fields from req.body
   const firstPage = req.body;

    // Required fields for validation
    // const requiredFields = {
    //   carData: ['name', 'askingPrice', 'year', 'location', 'status', 'condition',
    //             'transmission', 'fuel', 'color', 'mileage', 'bodyType',
    //             'engineSize', 'gearbox', 'owners', 'serviceHistory', 'seats',
    //             'doors', 'numberPlate', 'email', 'phone', 'postcode',
    //             'dateOfRegistration'],
    //   certifyData: ['agreeToTerms', 'agreeToTerms1', 'agreeToTerms2',
    //                 'agreeToTerms3', 'agreeToTerms4', 'agreeToTerms5',
    //                 'bankName', 'sortCode', 'accountNumber', 'fullName',
    //                 'valuation', 'fullAddress'],
    //   paymentData: ['amount', 'agreeToTermsPayment']
    // };

    // // Function to check for missing fields
    // const findMissingFields = (fields, data) => {
    //   return fields.filter(field => !data[field] && data[field] !== false);
    // };

    // // Check for missing fields
    // const missingCarData = findMissingFields(requiredFields.carData, req.body);
    // const missingCertifyData = findMissingFields(requiredFields.certifyData, req.body);
    // const missingPaymentData = findMissingFields(requiredFields.paymentData, req.body);

    // if (missingCarData.length || missingCertifyData.length || missingPaymentData.length) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: "Missing required fields",
    //     missingFields: {
    //       carData: missingCarData,
    //       certifyData: missingCertifyData,
    //       paymentData: missingPaymentData
    //     }
    //   });
    // }

    // Handle image uploads
    console.log(req.files);

    const imageUrls =
      req.files?.images1?.map((file) => `/images/${file.filename}`) || [];
    console.log("pp",imageUrls)
    firstPage.images = imageUrls;
    

    // Car data
    // const carData = {
    //   name,
    //   // year: Number(year),
    //   location,
    //   status,
    //   transmission: fuel,
    //   fuel: bodyType,
    //   color,
    //   engineSize: Number(engineSize),
    //   gearbox: owners,
    //   owners: Number(owners),
    //   seats: Number(seats),
    //   doors: Number(doors),

    //   dateOfRegistration,
    //   datePosted: datePosted || new Date(),
    //   owner: req.session.user._id,
    // };

    firstPage.askingPrice = Number(firstPage.askingPrice);
    firstPage.mileage = Number(firstPage.mileage);
    
    firstPage.images = imageUrls,
      firstPage.agreeToInspection= firstPage.agreeToTerms === "true",
      firstPage.phoneCommunication =  firstPage.phoneCommunication === "true",
    
      firstPage.emailCommunication = firstPage.emailCommunication === "true"
  

const firstPageData = {
  firstPage: firstPage
};

    // Save the combined data to the database
    const newCar = new Car(firstPageData);
    const savedCar = await newCar.save();

    // Respond with the saved car data
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

module.exports = {
  createCar,
  createCarFirstPage,
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
  getList
};
