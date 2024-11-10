const express = require("express");
const session = require("express-session");

const services = require("../Services/services.js");
const controller = require("../Controllers/userController.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

// Define your session middleware
const sessionMiddleware = session({
  secret: "emqlfqlekfm1354554w5f7e5",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }, // Adjust the secure option based on your deployment environment
});

// Create a new user
router.post("/create", controller.createUser);

// Update user details (full name and password)
router.put("/edit", controller.updateUser);

router.put("/editUser", controller.updateUserInfo);

// Delete user by email
router.delete("/deleteUser/:email", controller.deleteUser);

// Get all users (full name, email, and hashed password)
router.get("/getAll", controller.getAllUsers);

router.post("/getWishlist", controller.getWishlist);

router.put("/deleteFromWishlist", controller.deleteFromWishlist);

router.put("/addToWishlist", controller.addToWishlist);

router.post("/login", services.login);

router.post("/logout", sessionMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
