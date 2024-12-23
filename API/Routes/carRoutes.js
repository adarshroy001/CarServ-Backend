// const express = require("express");
// const { upload } = require("../middlewares/multer.js");
// const isAuthenticated = require("../middlewares/authentication.js");

// const router = express.Router();

// const carController = require("../Controllers/carController.js");

// router.post(
//   "/create",
//   isAuthenticated,
//   upload.array("images", 10),
//   carController.createCar
// );

// // Update car details
// router.put(
//   "/edit/:id",
//   isAuthenticated,
//   upload.array("images"),
//   carController.updateCar
// );

// // Delete car by id
// router.delete("/delete/:id", carController.deleteCar);

// router.get("/getAll", carController.getAllCars);
// // Get latest cars
// router.get("/getLatest", carController.getLatest);

// router.get("/makes", carController.getMakes);
// router.get("/models", carController.getModels);

// // Correct route for getting car count
// router.get("/count", carController.getCarCount);

// router.get("/vrn/:vrn", carController.getVehicleDataByVRN);

// router.get("/:id", carController.getCar);

// module.exports = router;

const express = require("express");
const { upload } = require("../middlewares/multer.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

// Import the controller object
const carController = require("../Controllers/carController.js");

// Define routes using the controller object's methods
router.post(
  "/create",
  isAuthenticated,
  upload.array("images", 10),
  carController.createCar
);

// Update car details
router.put(
  "/edit/:id",
  isAuthenticated,
  upload.array("images"),
  carController.updateCar
);

// Delete car by id
router.delete("/delete/:id", carController.deleteCar);

// Get all cars
router.get("/getAll", carController.getAllCars); // Use getAllCars, not getCar

// Get latest cars
router.get("/getLatest", carController.getLatest);

router.get("/makes", carController.getMakes);
router.get("/models", carController.getModels);

// Correct route for getting car count
router.get("/count", carController.getCarCount); // Use getCarCount, not getCar

router.get("/vrn/:vrn", carController.getVehicleDataByVRN);

router.get("/:id", carController.getCar);

module.exports = router;
