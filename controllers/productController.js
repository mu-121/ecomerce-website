const Product = require("../models/productModel")
const fetchProducts = async (req, res) => {
    let randomProducts = await Product.aggregate([{ $sample: { size: 12 } }])
    res.render("home", {
        products: randomProducts
    })
}

const getProducts = async (category) => {
    let products = await Product.find({ category: category })
    return products
}

const findProduct = async (product) => {
    let products = await Product.find({ name: product })
    return products
}

const findProductById = async (prodId) => {
    let products = await Product.find({ _id: prodId })
    return products
}

module.exports = {fetchProducts, getProducts, findProduct, findProductById};
