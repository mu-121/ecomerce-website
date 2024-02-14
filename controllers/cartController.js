const Cart = require("../models/cartModel")
const validator = require('validator')
const insertCart = async (userId, prodId, quantity) => {
    const cart = new Cart({
        user: userId,
        items: [
          {
            product: prodId,
            quantity: quantity
          }
        ]
      });
    await cart.save();
  }
const findCart = async (userId) => {
    let products = await Cart.find({ user: userId })
    return products
}

const deleteCart = async (userId) => {
    const result = await Cart.deleteMany({ user: userId })
}

module.exports = {insertCart, findCart, deleteCart};
