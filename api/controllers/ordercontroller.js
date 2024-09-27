const OrderModel = require("../Model/OrderModel");

const storeUserDetails = (req, res) => {
  const {
    currentDate,
    name,
    email,
    city,
    state,
    heading,
    height,
    width,
    shippingAddress,
    totalOrderAmount,
    productDetails,
    selectedPaymentOption,
  } = req.body;

  // Perform validation on the received data

  const order = new OrderModel({
    currentDate,
    name,
    email,
    city,
    state,
    heading,
    height,
    width,
    shippingAddress,
    totalOrderAmount,
    productDetails,
    selectedPaymentOption,
  });

  order
    .save()
    .then(() => {
      res.status(201).json({ message: "Order placed successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

// Controller to get all orders from the database
const getOrders = async (req, res) => {
  try {
    // Retrieve all orders from the database using your Order model
    const orders = await OrderModel.find();

    // Return the orders as a JSON response
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrdersByName = async (req, res) => {
  try {
    // Retrieve the username from the request headers
    const name = req.headers.name;

    // Use the username to filter orders for that specific user
    const orders = await OrderModel.find({ name: name });

    // Return the filtered orders as a JSON response
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by its ID and remove it
    const deletedOrder = await OrderModel.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      // If the order with the provided ID doesn't exist, return a 404 Not Found response
      return res.status(404).json({ message: "Order not found" });
    }

    // If the order was successfully deleted, return a success message along with the deleted order
    res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  storeUserDetails,
  getOrders,
  getOrdersByName,
  deleteOrderById,
};
