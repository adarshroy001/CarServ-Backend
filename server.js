const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session"); // Add this line
const path = require("path");
const userRoutes = require("./API/Routes/userRoutes");
const carsRoutes = require("./API/Routes/carRoutes");
const bookingsRoutes = require("./API/Routes/BookingRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // create a unique filename
  },
});

app.use(
  session({
    secret: "emqlfqlekfm1354554w5f7e5", // Change this to a strong, random string
    resave: false,
    saveUninitialized: false,
  })
);

const upload = multer({ storage }).array("images", 5); // 'images' is the field name for multiple file uploads

// routes
app.use("/users", userRoutes);
app.use("/cars", carsRoutes);
app.use("/bookings", bookingsRoutes);

// Route to handle multiple image uploads
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const filenames = req.files.map((file) => file.filename);
    res.json({ filenames });
  });
});

// Replace with your MongoDB URI
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongodb");
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.log("Error Connecting to mongodb: " + error);
  });
