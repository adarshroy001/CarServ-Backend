const express = require("express");
const { upload } = require("../middlewares/multer.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

// Import the controller object
const buyerController = require("../Controllers/buyerController.js");

// Define routes using the controller object's methods
router.post(
  "/create",
  // isAuthenticated,
  upload.array("images", 10),
  buyerController.createBuyCar
);

module.exports = router;