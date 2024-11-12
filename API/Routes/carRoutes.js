const express = require("express");
const { upload } = require("../middlewares/multer.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

const carController = require("../Controllers/carController.js");

// Create a new car
router.post(
  "/create",
  isAuthenticated,
  upload.array("images"),
  carController.createCar
);

// Update car details
router.put("/edit/:id", carController.updateCar);

// Delete car by id
router.delete("/delete/:id", carController.deleteCar);

// Get all cars
router.get("/getAll", carController.getAllCars);

module.exports = router;
