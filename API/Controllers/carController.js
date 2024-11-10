// Car model import
const Car = require('../Models/carModel');

// Function for creating a new car entry
const createCar = async (req, res) => {
  try {
    // Extracting car details from the request body
    const id = parseInt(Math.floor(Math.random() * 900) + 100);
    const {
      name,
      price,
      year,
      description,
      datePosted,
      location,
      status,
      condition,
      transmission,
      fuel,
      color,
      mileage,
      bodyType,
      engine,
      VIN,
      exterior,
      interior,
      safety,
    } = req.body;

    // Extracting the filenames of uploaded images from req.files array

    // Creating a new car object with details and images
    const newCar = await Car.create({
      id,
      name,
      price,
      year,
      description,
      datePosted,
      location,
      status,
      condition,
      transmission,
      fuel,
      color,
      mileage,
      bodyType,
      engine,
      VIN,
      exterior,
      interior,
      safety,
    });

    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to update car details
const updateCar = async (req, res) => {
  try {
    console.log(req.body);
    // Extracting car details from the request body
    const {
      name,
      price,
      year,
      description,
      datePosted,
      location,
      status,
      condition,
      transmission,
      fuel,
      color,
      mileage,
      bodyType,
      engine,
      VIN,
      exterior,
      interior,
      safety,
    } = req.body;

    // Extracting the filenames of uploaded images from req.files array
    // const images = req.files.map((file) => file.filename);

    // Updating the car object with details and images
    const updatedCar = await Car.updateOne(
      { id: req.params.id},
      {
        $set: {
          name,
          price,
          year,
          description,
          datePosted,
          location,
          status,
          condition,
          transmission,
          fuel,
          color,
          mileage,
          bodyType,
          engine,
          VIN,
          exterior,
          interior,
          safety
        }
      },
      { new: true }
    );

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error('Update Car Error:', error);
    res.status(500).json({ message: 'Error updating car details' });
  }
};

// Controller function to delete car by id
const deleteCar = async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedCar = await Car.deleteOne({ id: req.params.id });

    if (deletedCar.deletedCount === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).send({ message: `Successfully deleted ${req.params.id}`}); // 204 No Content indicates successful deletion
  } catch (error) {
    console.error('Delete Car Error:', error);
    res.status(500).json({ message: 'Error in car deletion' });
  }
};

// Function for retrieving a list of all cars
const getAllCars = async (req, res) => {
  try {
    const carList = await Car.find({});
    res.status(200).json(carList);
  } catch (error) {
    console.error('Get All Cars Error:', error);
    res.status(500).json({ message: 'Error retrieving cars' });
  }
};

module.exports = {
  createCar,
  updateCar,
  deleteCar,
  getAllCars,
};
