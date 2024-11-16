const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session"); // Add this line
const MongoDBSession = require("connect-mongodb-session")(session);
const path = require("path");
const dotenv = require("dotenv");

const userRoutes = require("./API/Routes/userRoutes");
const carsRoutes = require("./API/Routes/carRoutes");
const bookingsRoutes = require("./API/Routes/BookingRoutes");

dotenv.config();
const app = express();
const mongoURI = process.env.MONGODB_URI;

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "emqlfqlekfm1354554w5f7e5", // Change this to a strong, random string
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Adjust the secure option based on your deployment environment
      maxAge: 1000 * 3600 * 24 * 7,
      httpOnly: true, // Don't expose the session ID to the client-side JavaScript
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    store,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_SIDE_URL, // Change this to the appropriate URL for your application
    credentials: true, // Enable cookies for session management
  })
);

// routes
app.use("/users", userRoutes);
app.use("/cars", carsRoutes);
app.use("/bookings", bookingsRoutes);

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
