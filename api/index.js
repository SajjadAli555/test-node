// @ts-nocheck
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const httpServer = http.createServer(app);
const connectDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log("Database connection failed:", error);
    }
  }
};

connectDatabase();

const io = new Server(httpServer, {
  cors: {
    origin: "https://e-com-ui-nine.vercel.app" || "http://localhost:3000", // Replace with your frontend origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const router = require("./Router/router");
app.use(router);
app.get("/api/message", (req, res) => {
  res.json({ message: "This is a simple Node.js API!" });
});
const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
