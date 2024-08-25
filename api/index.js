const express = require("express");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Sample API route
app.get("/api/message", (req, res) => {
  res.json({ message: "This is a simple Node.js API!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
