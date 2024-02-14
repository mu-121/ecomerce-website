const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      description: {
        type: String
      }
});

module.exports = mongoose.model('Product', productSchema);