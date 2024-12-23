// const Car = require("../Models/carModel");
// const User = require("../Models/userModels");
// const { getStaticFilePath, getLocalPath } = require("../utils/helpers");
// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");

// // Function for creating a new car entry
// const createCar = async (req, res) => {
//   try {
//     console.log("Received car data:", req.body);
//     console.log("Received files:", req.files);

//     const carData = req.body;

//     const imageUrls = req.files
//       ? req.files.map((file) => `/images/${file.filename}`)
//       : [];
//     carData.images = imageUrls;

//     if (typeof carData.features === "string") {
//       try {
//         carData.features = JSON.parse(carData.features);
//       } catch (error) {
//         console.error("Error parsing features:", error);
//         return res.status(400).json({ message: "Invalid features format" });
//       }
//     }

//     const requiredFields = [
//       "numberPlate",
//       "mileage",
//       "askingPrice",
//       "email",
//       "phone",
//       "postcode",
//       "fuel",
//       "transmission",
//       "bodyType",
//       "engineSize",
//       "owners",
//       "serviceHistory",
//       "seats",
//       "doors",
//       "color",
//       "dateOfRegistration",
//       "name",
//     ];

//     const missingFields = requiredFields.filter((field) => !carData[field]);

//     if (missingFields.length > 0) {
//       console.error("Missing required fields:", missingFields);
//       return res.status(400).json({
//         status: "fail",
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     carData.datePosted = new Date();
//     carData.owner = req.session.user._id;

//     const newCar = new Car(carData);
//     await newCar.save();

//     console.log("Processed image URLs:", carData.images);

//     res.status(201).json({
//       status: "success",
//       data: {
//         car: newCar,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating car:", error);
//     res.status(500).json({
//       status: "fail",
//       message: error.message,
//     });
//   }
// };

// // Controller function to update car details
// const updateCar = async (req, res) => {
//   try {
//     console.log(req.body, req.files);
//     const carId = req.params.id;
//     const {
//       name,
//       price,
//       year,
//       description,
//       datePosted,
//       location,
//       status,
//       condition,
//       transmission,
//       fuel,
//       color,
//       mileage,
//       bodyType,
//       engine,
//       VIN,
//       exterior,
//       interior,
//       safety,
//       removedImages,
//       numberPlate,
//       askingPrice,
//       email,
//       phone,
//       postcode,
//       publishPhone,
//       publishEmail,
//       engineSize,
//       gearbox,
//       owners,
//       serviceHistory,
//       seats,
//       doors,
//       agreeToInspection,
//       dateOfRegistration,
//     } = req.body;

//     if (
//       !name ||
//       !price ||
//       !year ||
//       !datePosted ||
//       !location ||
//       !status ||
//       !condition ||
//       !transmission ||
//       !fuel ||
//       !color ||
//       !mileage ||
//       !bodyType ||
//       !engine ||
//       !VIN ||
//       !exterior ||
//       !interior ||
//       !safety ||
//       !numberPlate ||
//       !email ||
//       !phone ||
//       !postcode ||
//       !publishPhone ||
//       !publishEmail ||
//       !engineSize ||
//       !gearbox ||
//       !owners ||
//       !serviceHistory ||
//       !seats ||
//       !doors ||
//       !agreeToInspection ||
//       !dateOfRegistration
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const exteriorArray = JSON.parse(exterior);
//     const interiorArray = JSON.parse(interior);
//     const safetyArray = JSON.parse(safety);
//     const locationObj = JSON.parse(location);
//     const datePostedDate = new Date(datePosted);
//     const removedImagesArray = JSON.parse(removedImages);

//     if (
//       !locationObj ||
//       (!exteriorArray && !exteriorArray.length) ||
//       (!interiorArray && !interiorArray.length) ||
//       (!safetyArray && !safetyArray.length)
//     ) {
//       return res.status(400).json({ message: "Invalid fields" });
//     }

//     const car = await Car.findById(carId);

//     if (!car) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     const remainingImages = car.images.filter(
//       (image) => !removedImagesArray.includes(image.localPath)
//     );

//     for (const localPath of removedImagesArray) {
//       const imageToRemove = car.images.find(
//         (image) => image.localPath === localPath
//       );
//       if (imageToRemove && imageToRemove.localPath) {
//         const filePath = path.join(
//           __dirname,
//           "..",
//           "..",
//           imageToRemove.localPath
//         );
//         fs.unlink(filePath, (err) => {
//           if (err) console.log("Error while removing local files: ", err);
//           else {
//             console.log("Removed local: ", localPath);
//           }
//         });
//       }
//     }

//     const newImages =
//       req.files && req.files.length
//         ? req.files.map((image) => {
//             const imageUrl = getStaticFilePath(req, image.filename);
//             const imageLocalPath = getLocalPath(image.filename);
//             return { url: imageUrl, localPath: imageLocalPath };
//           })
//         : [];

//     // Updating the car object with details and images
//     car.images = [...remainingImages, ...newImages];
//     car.name = name;
//     car.price = price;
//     car.year = year;
//     car.datePosted = datePostedDate;
//     car.location = locationObj;
//     car.status = status;
//     car.condition = condition;
//     car.transmission = transmission;
//     car.fuel = fuel;
//     car.color = color;
//     car.mileage = mileage;
//     car.bodyType = bodyType;
//     car.engine = engine;
//     car.VIN = VIN;
//     car.exterior = exteriorArray;
//     car.interior = interiorArray;
//     car.safety = safetyArray;
//     car.numberPlate = numberPlate;
//     car.askingPrice = askingPrice;
//     car.email = email;
//     car.phone = phone;
//     car.postcode = postcode;
//     car.publishPhone = publishPhone;
//     car.publishEmail = publishEmail;
//     car.engineSize = engineSize;
//     car.gearbox = gearbox;
//     car.owners = owners;
//     car.serviceHistory = serviceHistory;
//     car.seats = seats;
//     car.doors = doors;
//     car.agreeToInspection = agreeToInspection;
//     car.dateOfRegistration = new Date(dateOfRegistration);

//     await car.save();

//     res.status(200).json(car);
//   } catch (error) {
//     console.error("Update Car Error:", error);
//     res.status(500).json({ message: "Error updating car details" });
//   }
// };

// const deleteCar = async (req, res) => {
//   try {
//     console.log(req.params.id);
//     const deletedCar = await Car.deleteOne({ _id: req.params.id });

//     if (deletedCar.deletedCount === 0) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     res.status(200).send({ message: `Successfully deleted ${req.params.id}` });
//   } catch (error) {
//     console.error("Delete Car Error:", error);
//     res.status(500).json({ message: "Error in car deletion" });
//   }
// };

// const getAllCars = async (req, res) => {
//   try {
//     const carList = await Car.find({});
//     console.log(
//       "Retrieved cars:",
//       carList.map((car) => ({
//         id: car._id,
//         name: car.name,
//         imageCount: car.images.length,
//       }))
//     );
//     console.log("Cars data being sent:", carList);
//     res.status(200).json(carList);
//   } catch (error) {
//     console.error("Get All Cars Error:", error);
//     res.status(500).json({ message: "Error retrieving cars" });
//   }
// };

// const getLatest = async (req, res) => {
//   try {
//     const latestCars = await Car.find({}).sort({ datePosted: -1 }).limit(4);
//     res.status(200).json(latestCars);
//   } catch (error) {
//     console.error("Get Latest Cars Error:", error);
//     res.status(500).json({ message: "Error retrieving latest cars" });
//   }
// };

// const getMakes = async (req, res) => {
//   try {
//     const cars = await Car.find({}, "name");

//     const makes = [...new Set(cars.map((car) => car.name.split(" ")[0]))];

//     res.status(200).json(makes);
//   } catch (error) {
//     console.error("Get Makes Error:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching makes", error: error.toString() });
//   }
// };

// const getModels = async (req, res) => {
//   try {
//     const { make } = req.query;
//     const cars = await Car.find({ name: new RegExp("^" + make, "i") }, "name");
//     const models = cars.map((car) => {
//       const nameParts = car.name.split(" ");
//       return nameParts.slice(1).join(" ");
//     });
//     res.status(200).json([...new Set(models)]);
//   } catch (error) {
//     console.error("Get Models Error:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching models", error: error.toString() });
//   }
// };

// const getCarCount = async (req, res) => {
//   try {
//     const filter = { ...req.query };

//     if (filter.year) {
//       const { from, to } = filter.year;
//       if (from) filter.year = { $gte: parseInt(from) };
//       if (to) filter.year = { ...filter.year, $lte: parseInt(to) };
//       if (!from && !to) delete filter.year;
//     }

//     const count = await Car.countDocuments(filter);
//     res.status(200).json(count);
//   } catch (error) {
//     console.error("Get Car Count Error:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching car count", error: error.toString() });
//   }
// };

// const getCar = async (req, res) => {
//   try {
//     const carId = req.params.id;
//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({ message: "Car not found" });
//     }
//     res.status(200).json(car);
//   } catch (error) {
//     console.error("Get Car Error:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching car", error: error.toString() });
//   }
// };

// const getVehicleDataByVRN = async (req, res) => {
//   try {
//     const apiKey = "26dcf929-90ee-4b72-ba1b-24d5dbf15c7b";
//     const vrn = req.params.vrn.replace(/\s/g, "").toUpperCase();

//     const response = await axios.get(
//       `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${vrn}`
//     );

//     if (response.data.Response.StatusCode === "Success") {
//       const vehicleData = response.data.Response.DataItems;
//       res.json(vehicleData);
//     } else {
//       console.error("UK Vehicle Data API Error:", response.data.Response);
//       res.status(404).json({ error: "Vehicle not found or API error." });
//     }
//   } catch (error) {
//     console.error("Error fetching vehicle data:", error);
//     res.status(500).json({ error: "Error fetching vehicle data." });
//   }
// };

// module.exports = {
//   createCar,
//   updateCar,
//   deleteCar,
//   getAllCars,
//   getLatest,
//   getMakes,
//   getModels,
//   getCarCount,
//   getCar,
//   getVehicleDataByVRN,
// };

const Car = require("../Models/carModel");
const User = require("../Models/userModels");
const { getStaticFilePath, getLocalPath } = require("../utils/helpers");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Function for creating a new car entry
const createCar = async (req, res) => {
  try {
    console.log("Received car data:", req.body);
    console.log("Received files:", req.files);

    const carData = req.body;

    // Correctly handle image uploads and store URLs in the database
    const imageUrls = req.files
      ? req.files.map((file) => `/images/${file.filename}`)
      : [];
    carData.images = imageUrls;

    // Parse features
    if (typeof carData.features === "string") {
      try {
        carData.features = JSON.parse(carData.features);
      } catch (error) {
        console.error("Error parsing features:", error);
        return res.status(400).json({ message: "Invalid features format" });
      }
    }

    // Check for required fields.  Use fuel and transmission, NOT fuelType and gearbox
    const requiredFields = [
      "numberPlate",
      "mileage",
      "askingPrice",
      "email",
      "phone",
      "postcode",
      "fuel",
      "transmission",
      "bodyType",
      "engineSize",
      "owners",
      "serviceHistory",
      "seats",
      "doors",
      "color",
      "dateOfRegistration",
      "name",
    ];

    const missingFields = requiredFields.filter((field) => !carData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        status: "fail",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    carData.datePosted = new Date();
    carData.owner = req.session.user._id;

    const newCar = new Car(carData);
    await newCar.save();

    console.log("Processed image URLs:", carData.images); // Added log

    res.status(201).json({
      status: "success",
      data: {
        car: newCar,
      },
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
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
      publishPhone,
      publishEmail,
      engineSize,
      gearbox,
      owners,
      serviceHistory,
      seats,
      doors,
      agreeToInspection,
      dateOfRegistration,
    } = req.body;

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
      !publishPhone ||
      !publishEmail ||
      !engineSize ||
      !gearbox ||
      !owners ||
      !serviceHistory ||
      !seats ||
      !doors ||
      !agreeToInspection ||
      !dateOfRegistration
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
    car.publishPhone = publishPhone;
    car.publishEmail = publishEmail;
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
    console.log(
      "Retrieved cars:",
      carList.map((car) => ({
        id: car._id,
        name: car.name,
        imageCount: car.images.length,
      }))
    );
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
    const apiKey = "26dcf929-90ee-4b72-ba1b-24d5dbf15c7b";
    const vrn = req.params.vrn.replace(/\s/g, "").toUpperCase();

    const response = await axios.get(
      `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${vrn}`
    );

    if (response.data.Response.StatusCode === "Success") {
      const vehicleData = response.data.Response.DataItems;
      res.json(vehicleData);
    } else {
      console.error("UK Vehicle Data API Error:", response.data.Response);
      res.status(404).json({ error: "Vehicle not found or API error." });
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    res.status(500).json({ error: "Error fetching vehicle data." });
  }
};

module.exports = {
  createCar,
  updateCar,
  deleteCar,
  getAllCars,
  getLatest,
  getMakes,
  getModels,
  getCarCount,
  getCar,
  getVehicleDataByVRN,
};
