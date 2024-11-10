const User = require("../Models/userModels");
const bcrypt = require("bcrypt");

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

      res
        .status(200)
        .json({ message: "Login successful", user: req.session.user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
