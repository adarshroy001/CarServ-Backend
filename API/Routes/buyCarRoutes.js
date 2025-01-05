const express = require("express");
const { upload } = require("../middlewares/multer.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

// Import the controller object
const buyCarController = require("../Controllers/buyCarController.js");

// Define routes using the controller object's methods
router.post(
  "/create",
  // isAuthenticated,
  upload.array("images", 10),
  buyCarController.createBuyCar
);

module.exports = router;