const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const adminController = require("../controllers/admincontrollers");
const productController = require("../controllers/admincontrollers");
const userController = require("../controllers/usercontroller");
const paymentController = require("../controllers/paymentscontroller");
const orderController = require("../controllers/ordercontroller");
const { createPayPalPayment } = require("../controllers/paymentscontroller");
const validateToken = require("../Middlewares/authenticate");
const { getUserData } = require("../controllers/usercontroller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique file name
  },
});
const upload = multer({ storage: storage });

//Admin Routes
router.get("/api/message", (req, res) => {
  res.json({ message: "This is a simple Node.js API!" });
});
router.post("/api/adminlogin", adminController.adminLogin);
router.post(
  "/api/products",
  upload.single("image"),
  productController.createProduct
);
router.get("/api/products", productController.getProducts);
router.get("/api/products/:id", productController.getProductById);
router.delete("/api/products/:id", adminController.deleteProductById);
router.put("/api/products/:id", adminController.updateProductById);
//User Routes
router.post(
  "/api/register",
  upload.single("avatar"),
  userController.registerUser
);
router.get("/api/users", userController.getUsers);
router.get("/api/users/:id", userController.getUserById);
router.delete("/api/users/:id", userController.deleteUserById);
router.put("/api/users/:id", userController.updateUserById);
router.post("/api/signin", userController.signInUser);
router.get("/api/user-data", validateToken, getUserData);
//Payment Routes
router.post(
  "/api/create-payment-intent",
  paymentController.createPaymentIntent
);
router.post("/api/create-payment", (req, res) => {
  createPayPalPayment(req, res);
});
//order routes
router.post("/api/store-user-details", orderController.storeUserDetails);
router.get("/api/get-orders", orderController.getOrders);
router.get("/api/get-ordersname", orderController.getOrdersByName);
router.delete("/api/delete-order/:orderId", orderController.deleteOrderById);

//Logout End Point
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user Logout");
});

module.exports = router;
