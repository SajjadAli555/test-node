const User = require("../Model/userSchema");
const multer = require("multer");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validateToken = require("../Middlewares/authenticate");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:/ecommerce/server/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique file name
  },
});
const jwtSecret = process.env.JWT_SECRET;

const upload = multer({ storage: storage });

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;
    const avatar = req.file ? req.file.filename : undefined; // Get the uploaded image filename

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already registered" });
    }

    // Hash the password and cpassword
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedCPassword = await bcrypt.hash(cpassword, 12);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      cpassword: hashedCPassword,
      avatar, // Store the uploaded image filename
    });

    // Save the user to the database
    await newUser.save();

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database, excluding sensitive fields like 'password' and 'cpassword'
    const users = await User.find({}, "-password -cpassword");

    // Send the list of users to the frontend
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by ID, excluding sensitive fields like 'password' and 'cpassword'
    const user = await User.findById(userId, "-password -cpassword");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user details to the frontend
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user with the given ID exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await User.findByIdAndRemove(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user with the given ID exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user properties based on the request body
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the fields!" });
    }

    // Find the user by email
    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // If credentials are valid, create a JWT token
    const token = jwt.sign({ userId: userLogin._id }, jwtSecret, {
      expiresIn: "5h",
    });

    // Update the user's token in the database
    userLogin.token = token;
    await userLogin.save();

    // Return the token along with a success message and user's name
    res.json({
      message: "User signed in successfully",
      name: userLogin.name,
      token,
    });
  } catch (error) {
    // Handle errors properly and provide specific error messages
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getUserData = async (req, res) => {
  const userId = req.user.userId; // Extract the user's ID from the JWT token payload

  try {
    // Fetch user data from the database based on the user's ID
    const user = await User.findById(userId).select("-password -cpassword"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  signInUser,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUserData,
};
