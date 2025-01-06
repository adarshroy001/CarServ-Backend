const buyCar = require("../Models/buyCarModel");

const createBuyCar = async (req, res) => {
  try {
    const buyCarData = req.body;
    console.log("ok", buyCarData);

    const imageUrls = req.files
      ? req.files.map((file) => `/images/${file.filename}`)
      : [];
    buyCarData.images = imageUrls;

    const requiredFields = ["fullName", "address", "postcode"];
    console.log(requiredFields);

    const missingFields = requiredFields.filter((field) => !buyCarData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        status: "fail",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newBuyCar = new buyCar(buyCarData);
    await newBuyCar.save();
    res.status(201).json({
      status: "success",
      data: {
        buyCar: newBuyCar,
      },
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({
      status: "fail1",
      message: error.message,
    });
  }
};

module.exports = {
  createBuyCar,
};
