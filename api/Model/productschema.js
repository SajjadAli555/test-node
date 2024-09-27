const mongoose = require('mongoose');

// Define the color schema (optional if not needed elsewhere)
const colorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
});

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: function (array) {
        return array.length > 0;
      },
      message: 'At least one image URL is required.',
    },
  },
  colors: {
    type: [String], // Array of color codes
    required: true,
    validate: {
      validator: function (array) {
        return array.length > 0;
      },
      message: 'At least one color code is required.',
    },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  starRating: {
    type: Number,
    default: 0,
    required: true,
  },
  stockAvailability: {
    type: Number,
    default: 0,
    required: true,
  },
});

// Create the Product model
const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
