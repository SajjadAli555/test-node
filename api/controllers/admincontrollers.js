const ProductModel = require("../Model/productschema");
require("dotenv").config();
const adminCredentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

const adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    res.status(200).json({ message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      company,
      starRating,
      stockAvailability,
      featured,
      colors,
    } = req.body;

    const images = req.file ? req.file.filename : undefined; // Get the uploaded image filename

    const newProduct = new ProductModel({
      name,
      description,
      category,
      price,
      company,
      starRating,
      stockAvailability,
      featured,
      colors,
      images,
    });

    await newProduct.save();

    // Respond with the newly created product in the desired format
    res.status(201).json({
      id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: newProduct.price,
      company: newProduct.company,
      starRating: newProduct.starRating,
      stockAvailability: newProduct.stockAvailability,
      featured: newProduct.featured,
      colors: newProduct.colors,
      images: newProduct.images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    // Format the products to match the desired structure
    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      company: product.company,
      price: product.price,
      colors: product.colors,
      images: product.images,
      description: product.description,
      starRating: product.starRating,
      stockAvailability: product.stockAvailability,
      category: product.category,
      featured: product.featured,
    }));

    res.status(200).json(formattedProducts); // Send an array of formatted products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      // Return a 404 status code and an error message if the product is not found
      return res.status(404).json({ message: "Product not found" });
    }

    // Format the product data to match the desired structure
    const formattedProduct = {
      id: product._id,
      name: product.name,
      company: product.company,
      price: product.price,
      colors: product.colors,
      images: product.images,
      description: product.description,
      starRating: product.starRating,
      stockAvailability: product.stockAvailability,
      category: product.category,
      featured: product.featured,
    };

    res.status(200).json(formattedProduct); // Send the product data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product with the given ID exists
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await ProductModel.findByIdAndRemove(productId);

    res.status(204).send(); // Send a 204 No Content response on successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body; // The updated data for the product

    // Check if the product with the given ID exists
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    await ProductModel.findByIdAndUpdate(productId, updateData);

    // Respond with the updated product
    const updatedProduct = await ProductModel.findById(productId);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  adminLogin,
  createProduct,
  getProducts,
  getProductById,
  deleteProductById,
  updateProductById,
};
