const Order = require("../models/orderModel")
const validator = require('validator')
const insertOrders = async (cart) => {
    await Order.insertMany(cart);
  }
const findOrders = async (userId) => {
    let products = await Order.find({ user: userId })
    return products
}

module.exports = {insertOrders, findOrders};
