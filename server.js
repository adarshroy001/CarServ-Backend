const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");

const userRoutes = require("./API/Routes/userRoutes");
const carsRoutes = require("./API/Routes/carRoutes");
const bookingsRoutes = require("./API/Routes/BookingRoutes");
const buyCarRoutes = require("./API/Routes/buyCarRoutes");
const servicesRoutes = require("./API/Routes/servicesRoutes");
const telemetryClient = require("./API/utils/azureLogsConnection");
const PageLog = require("./API/Models/pageLogsModel");

dotenv.config();
const app = express();
const mongoURI = process.env.API_APP_MONGODB_URI;

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("trust proxy", 1);

app.use(
  session({
    secret: "emqlfqlekfm1354554w5f7e5",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.API_APP_NODE_ENV === "production",
      maxAge: 1000 * 3600 * 24 * 7,
      httpOnly: true,
      sameSite: process.env.API_APP_NODE_ENV === "production" ? "none" : "lax",
    },
    store,
  })
);

app.use(
  cors({
    origin: process.env.API_APP_CLIENT_SIDE_URL,
    credentials: true,
  })
);

// routes
app.use("/users", userRoutes);
app.use("/cars", carsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/buyer", buyCarRoutes);
app.use("/services", servicesRoutes);

// Add this to test the database connection
app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Database connection error");
  }
});

// Error handling middleware

app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', async () => {
      const responseTime = Date.now() - startTime;

      try {
          await PageLog.create({
              metricName: 'ApiResponseTime',
              metricValue: responseTime,
              properties: {
                  apiEndpoint: req.originalUrl,
                  httpMethod: req.method,
                  statusCode: res.statusCode,
              },
          });

          telemetryClient.trackMetric({
            name: 'ApiResponseTime',
            value: responseTime,
            properties: {
                apiEndpoint: req.originalUrl,
                httpMethod: req.method,
                statusCode: res.statusCode,
            },
        });

      } catch (error) {
          console.error('Error logging API response time:', error);
      }
  });

  next();
});

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongodb");
    console.log("MongoDB URI:", mongoURI); // Log the URI (make sure to remove this in production)
    const port = process.env.API_APP_MongoDB_PORT || 4000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.log("Error Connecting to mongodb:", error);
  });
