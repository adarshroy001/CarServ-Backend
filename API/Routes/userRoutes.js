const express = require("express");

const services = require("../Services/services.js");
const controller = require("../Controllers/userController.js");
const isAuthenticated = require("../middlewares/authentication.js");

const router = express.Router();

// Create a new user
router.post("/create", controller.createUser);

// Update user details (full name and password)
router.put("/edit", isAuthenticated, controller.updateUser);

router.put("/editUser", isAuthenticated, controller.updateUserInfo);

// Delete user by email
router.delete("/", isAuthenticated, controller.deleteUser);

router.get("/", isAuthenticated, controller.getUser);

// Get all users (full name, email, and hashed password)
router.get("/getAll", controller.getAllUsers);

router.get("/getWishlist", isAuthenticated, controller.getWishlist);

router.put(
  "/deleteFromWishlist",
  isAuthenticated,
  controller.deleteFromWishlist
);

router.put("/addToWishlist", isAuthenticated, controller.addToWishlist);

router.put("/validatePassword", isAuthenticated, controller.validatePassword);

router.post("/login", services.login);

router.post("/google-oauth", services.loginGoogleOAuth);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
