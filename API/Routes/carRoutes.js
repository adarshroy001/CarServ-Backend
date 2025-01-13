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

router.post(
  "/create",
  isAuthenticated,
  upload.fields([{ name: "firstPageImages", maxCount: 10 }]),
  carController.createCar
);
router.post(
  "/createDetails",
  isAuthenticated,
  upload.fields([
    { name: "firstPageImages", maxCount: 10 },
    { name: "detailsImages", maxCount: 10 },
  ]),
  carController.createCarDetails
);
router.post(
  "/createCertify",
  isAuthenticated,
  upload.fields([
    { name: "firstPageImages", maxCount: 10 },
    { name: "detailsImages", maxCount: 10 },
    { name: "carImages", maxCount: 15 },
    { name: "serviceRecords", maxCount: 10 },
    { name: "logbook", maxCount: 10 },
    { name: "identy", maxCount: 10 },
  ]),
  carController.createCarCertify
);
router.post(
  "/createAdvertise",
  isAuthenticated,
  upload.fields([
    { name: "firstPageImages", maxCount: 10 },
    { name: "detailsImages", maxCount: 10 },
    { name: "carImages", maxCount: 15 },
    { name: "serviceRecords", maxCount: 10 },
    { name: "logbook", maxCount: 10 },
    { name: "identy", maxCount: 10 },
  ]),
  carController.createCarAdvertise
);

// Update car details
router.put(
  "/edit/:id",
  isAuthenticated,
  upload.array("images"),
  carController.updateCar
);

router.put(
  "/editListing/:id",
  // isAuthenticated,
  carController.softDelListing
);

// Delete car by id
router.delete("/delete/:id", carController.deleteCar);

// Get all cars
router.get("/getAll", carController.getAllCars); // Use getAllCars, not getCar

// Get latest cars
router.get("/getLatest", carController.getLatest);

//get carlist..
router.get("/getList", isAuthenticated, carController.getList);
//get car add Listing
router.get("/getCarList", isAuthenticated, carController.getListing);

router.get("/makes", carController.getMakes);
router.get("/models", carController.getModels);

// Correct route for getting car count
router.get("/count", carController.getCarCount); // Use getCarCount, not getCar

router.get("/vrn/:vrn", carController.getVehicleDataByVRN);

router.get("/:id", carController.getCar);

module.exports = router;
