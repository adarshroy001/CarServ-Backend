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
      const { oldPassword, newPassword } = req.body;

      console.log(oldPassword, newPassword);

      const foundUser = await User.findById(req.session.user._id);

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
      const userId = req.session.user._id;
      const updates = req.body; // Get all updates from request body

      // Find and update the user
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true, // Return the updated document
        runValidators: true, // Validate the updates against the schema
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User info updated", user: updatedUser });
    } catch (error) {
      console.error("Error updating user info:", error);
      res
        .status(500)
        .json({ message: "Error updating user info", error: error.message }); // Include error message
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userForDeletion = await User.findByIdAndDelete(
        req.session.user._id
      );

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
      const userId = req.session.user._id;
      const { carId } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: carId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "Car added to wishlist", user: updatedUser });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res
        .status(500)
        .json({ message: "Error adding to wishlist", error: error.message });
    }
  },

  deleteSavedSearch: async (req, res) => {
    try {
      const userId = req.session.user._id;
      const searchId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const searchIndex = user.savedSearches.findIndex(
        (search) => search._id.toString() === searchId
      );

      if (searchIndex === -1) {
        return res.status(404).json({ message: "Saved search not found" });
      }

      user.savedSearches.splice(searchIndex, 1);
      await user.save();

      res.status(200).json({ message: "Saved search deleted successfully" });
    } catch (error) {
      console.error("Error deleting saved search:", error);
      res
        .status(500)
        .json({ message: "Error deleting saved search", error: error.message });
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

  validatePassword: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { password } = req.body;
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return res.status(200).json({ message: "Password is valid" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.error("Error validating password", error);
      res.status(500).json({ message: "Error in validating password" });
    }
  },
  saveSearch: async (req, res) => {
    try {
      const userId = req.session.user._id; // Get userId from session
      const { savedSearch } = req.body;

      // Validate required fields
      if (!savedSearch.name || !savedSearch.filters) {
        return res.status(400).json({
          message: "Search name and filters are required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add the new search to the savedSearches array
      user.savedSearches.push({
        name: savedSearch.name,
        filters: savedSearch.filters,
        sortBy: savedSearch.sortBy || "relevance",
      });

      await user.save();

      res.status(200).json({
        message: "Search saved successfully",
        savedSearch: user.savedSearches[user.savedSearches.length - 1],
      });
    } catch (error) {
      console.error("Error saving search:", error);
      res.status(500).json({
        message: "Error saving search",
        error: error.message,
      });
    }
  },

  getSavedSearches: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user.savedSearches);
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      res.status(500).json({
        message: "Error fetching saved searches",
        error: error.message,
      });
    }
  },
};
