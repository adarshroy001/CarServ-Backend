// Car model import
const Car = require("../Models/carModel");
const User = require("../Models/userModels");
const { getStaticFilePath, getLocalPath } = require("../utils/helpers");
const fs = require("fs");
const path = require("path");

// Function for creating a new car entry
const createCar = async (req, res) => {
  try {
    // Extracting car details from the request body
    const {
      name,
      price,
      year,
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
      !safety
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exteriorArray = JSON.parse(exterior);
    const interiorArray = JSON.parse(interior);
    const safetyArray = JSON.parse(safety);
    const locationObj = JSON.parse(location);
    const datePostedDate = new Date(datePosted);

    if (
      !locationObj ||
      (!exteriorArray && !exteriorArray.length) ||
      (!interiorArray && !interiorArray.length) ||
      (!safetyArray && !safetyArray.length)
    ) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    // Extracting the filenames of uploaded images from req.files array
    const images =
      req.files && req.files.length
        ? req.files.map((image) => {
            const imageUrl = getStaticFilePath(req, image.filename);
            const imageLocalPath = getLocalPath(image.filename);
            return { url: imageUrl, localPath: imageLocalPath };
          })
        : [];

    if (!images && images.length === 0) {
      return res.status(400).json({ message: "Atleast one image is required" });
    }

    const user = req.session.user._id;

    // Creating a new car object with details and images
    const newCar = await Car.create({
      name,
      price,
      year,
      datePosted: datePostedDate,
      location: locationObj,
      status,
      condition,
      transmission,
      fuel,
      color,
      mileage,
      bodyType,
      engine,
      VIN,
      exterior: exteriorArray,
      interior: interiorArray,
      safety: safetyArray,
      images,
      owner: req.session.user._id,
    });

    // Adding car in the user listings
    await User.updateOne({ _id: user }, { $push: { listings: newCar._id } });

    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    console.error(error);
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
      !safety
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

    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({ message: "Error updating car details" });
  }
};

// // Controller function to fetch a car
// const getCar = async (req, res) => {
//   try {
//     const carId = req.params.id;

//     if (carId === "count") {
//       const count = await Car.countDocuments(req.query); // Correctly use req.query for filters
//       return res.status(200).json(count); // Return just the count, not an object
//     }

//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({ message: "Car not found" });
//     }
//     res.status(200).json(car);
//   } catch (error) {
//     console.error("Get Car Error:", error);
//     res.status(500).json({ message: "Error fetching car" });
//   }
// };

// Controller function to delete car by id
const deleteCar = async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedCar = await Car.deleteOne({ id: req.params.id });

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

module.exports = {
  createCar,
  updateCar,
  deleteCar,
  getAllCars,
  getLatest,
  getCar,
  getMakes,
  getModels,
  getCarCount,
};
