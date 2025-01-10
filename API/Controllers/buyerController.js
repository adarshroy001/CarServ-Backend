const buyer = require("../Models/buyerModel");

const createBuyCar = async (req, res) => {
  try {
    const buyCarData = req.body;
    console.log("ok", buyCarData);

    const imageUrls = req.files
      ? req.files.map((file) => `/images/${file.filename}`)
      : [];
    buyCarData.images = imageUrls;
    buyCarData.paymentStatus = "Completed";
    buyCarData.status = "Sold";
    buyCarData.userId = req.session.user._id;

    const requiredFields = [
      "fullName",
      "address1",
      "address2",
      "city",
      "postcode",
      "carId",
      "dateOfBirth",
    ];
    console.log(requiredFields);

    const missingFields = requiredFields.filter((field) => !buyCarData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        status: "fail",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newBuyer = new buyer(buyCarData);
    await newBuyer.save();
    res.status(201).json({
      status: "success",
      data: {
        buyer: newBuyer,
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
