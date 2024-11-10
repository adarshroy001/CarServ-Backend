const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");
const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const { Static_data } = require("../../assets/config");
const mongoose = require("mongoose");

module.exports = {
  createUser: async (req, res) => {
    const isAdmin = false;
    try {
      const { username, email, password, gender, phone, address } = req.body;
      // Implement enhanced password validation here

      const userRecord = new User({
        username,
        email,
        password,
        gender,
        phone,
        address,
        isAdmin,
      });
      await userRecord.save();

      // Save user information in the session
      req.session.user = {
        _id: userRecord._id,
        username: userRecord.username,
        email: userRecord.email,
        gender: userRecord.gender,
        phone: userRecord.phone,
        address: userRecord.address,
        isAdmin: userRecord.isAdmin,
        wishlist: userRecord.wishlist,
        bookings: userRecord.bookings,
      };

      res.status(200).json({
        message: "Successfully created user",
        user: req.session.user,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { oldPassword, newPassword, email } = req.body;

      console.log(oldPassword, newPassword);

      console.log(email);

      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        return res.status(404).json({ message: "User not located" });
      }

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        foundUser.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      if (!newPassword.match(/^(?=.*[a-zA-Z])(?=.*\d).+/)) {
        throw new Error("Password format is invalid.");
      }

      foundUser.password = newPassword;
      await foundUser.save();

      res.json({ message: "User information successfully modified" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUserInfo: async (req, res) => {
    const { email, gender, phone, address } = req.body;
    const foundUser = await User.findOne({ email });
    try {
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      foundUser.gender = gender;
      foundUser.phone = phone;
      foundUser.address = address;

      await foundUser.save();
      return res.status(200).json({ message: "User info updated" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user info" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { email } = req.params;

      const userForDeletion = await User.findOneAndDelete({ email });

      console.log("Delete User", req.body);

      if (!userForDeletion) {
        return res.status(404).json({ message: "No matching user found" });
      }

      res.json({ message: "User successfully deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error encountered" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find({}, "fullName email password");
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Error in retrieving user data" });
    }
  },

  getWishlist: async (req, res) => {
    try {
      const { email } = req.body;

      console.log(email);

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user.wishlist);
      // Find bookings based on wishlist IDs
      const wishlist = await Car.find({ id: { $in: user.wishlist } });
      console.log(wishlist);

      res.json(wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in retrieving user wishlist" });
    }
  },

  addToWishlist: async (req, res) => {
    const { email, wishlistId } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    foundUser.wishlist = [...foundUser.wishlist, wishlistId];

    await foundUser.save();
    return res.status(200).json({ message: "Car added to wishlist" });
  },

  deleteFromWishlist: async (req, res) => {
    const { email, wishlistId } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newArray = foundUser.wishlist.filter((item) => item !== wishlistId);

    foundUser.wishlist = newArray;

    await foundUser.save();
    return res.status(200).json({ message: "Car removed from wishlist" });
  },
};
