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

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(200).json({
          message: "User successfully Registered",
          user: req.session.user,
        });
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

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching user" });
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      const { username, gender, phone, address } = req.body;
      const foundUser = await User.findById(req.session.user._id);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      foundUser.username = username;
      foundUser.gender = gender;
      foundUser.phone = phone;
      foundUser.address = address;

      await foundUser.save();
      return res.status(200).json({ message: "User info updated" });
    } catch (error) {
      console.error(error);
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
      const userId = req.session.user._id;

      const user = await User.findById(userId).populate({
        path: "wishlist",
        model: Car,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const wishlist = user.wishlist.map((car) => car);
      res.status(200).json(wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in retrieving user wishlist" });
    }
  },

  addToWishlist: async (req, res) => {
    try {
      const { wishlistId } = req.body;
      const foundUser = await User.findById(req.session.user._id);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      foundUser.wishlist = [
        ...foundUser.wishlist,
        new mongoose.Types.ObjectId(wishlistId),
      ];

      await foundUser.save();
      return res.status(200).json({ message: "Car added to wishlist" });
    } catch (error) {
      console.error("Error adding to whishlist", error);
      res.status(500).json({ message: "Error in adding car to wishlist" });
    }
  },

  deleteFromWishlist: async (req, res) => {
    try {
      const { carId } = req.body;
      const foundUser = await User.findById(req.session.user._id);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const newArray = foundUser.wishlist.filter(
        (item) => item.toString() !== carId.toString()
      );

      foundUser.wishlist = newArray;

      await foundUser.save();
      return res.status(200).json({ message: "Car removed from wishlist" });
    } catch (error) {
      console.error("Error removing item from wishlist", error);
      res.status(500).json({ message: "Error in removing car from wishlist" });
    }
  },
};
