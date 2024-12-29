const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/mail");
const Otp = require("../Models/OtpModel");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      // Save user information in the session
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        wishlist: user.wishlist,
        bookings: user.bookings,
      };

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res
          .status(200)
          .json({ message: "Login successful", user: req.session.user });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  loginGoogleOAuth: async (req, res) => {
    try {
      const { email, username } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        const newUser = new User({
          username,
          email,
          gender: "Other",
          isEmailVerified: true,
        });
        await newUser.save();

        req.session.user = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          gender: newUser.gender,
          phone: newUser.phone,
          address: newUser.address,
          isAdmin: newUser.isAdmin,
          wishlist: newUser.wishlist,
          bookings: newUser.bookings,
          isEmailVerified: true,
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
        return;
      }

      if (user.password) {
        return res
          .status(400)
          .json({ message: "User already exists with credentials" });
      } else {
        req.session.user = {
          _id: user._id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          isAdmin: user.isAdmin,
          wishlist: user.wishlist,
          bookings: user.bookings,
          isEmailVerified: true,
        };
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }
          return res
            .status(200)
            .json({ message: "Login successful", user: req.session.user });
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  sendOTP: async (req, res) => {
    try {
      const id = req.session.user._id;
      const recipient = req.session.user.email;
      const subject = "OTP for email verification";
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const body = `
        <h1>Welcome to Live Autos</h1>
        <p>Your OTP is ${otp}</p>
      `;

      // Find the OTP document by userId
      let otpDoc = await Otp.findOne({ userId : id });

      if (otpDoc) {
        otpDoc.otp = otp;
        otpDoc.createdAt = new Date();
      } else {
        otpDoc = new Otp({
          otp: otp,
          userId: id,
          createdAt: new Date()
        });
      }
      await otpDoc.save();
      await sendMail(recipient, subject, body);
      console.log("Email sent successfully!");
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({success:false, error: "Internal server error" });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const { otp } = req.body;
      const userId = req.session.user._id;
      const otpDoc = await Otp.findOne({ userId });

      if(!userId){
        return res.status(401).json({success:false, message: "Unauthorized" });
      }

      if (!otpDoc) {
        return res.status(401).json({success:false, message: "Invalid OTP" });
      }

      if (otpDoc.otp !== otp) {
        return res.status(401).json({success:false, message: "Invalid OTP" });
      }

      await User.findByIdAndUpdate(
        userId,
        { emailVerified: true },
        { new: true }
      );

      req.session.user.isEmailVerified = true;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res
          .status(200)
          .json({success:true, message: "Login successful", user: req.session.user });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
