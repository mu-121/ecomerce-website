const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const user = require("./controllers/userController")
const product = require("./controllers/productController")
const cart = require("./controllers/cartController")
const order = require("./controllers/orderController")
const session = require('express-session');
let sess;

mongoose.connect("mongodb://localhost:27017/shopping").then(()=>{
    console.log("Connection Established...");
}).catch((err)=>{
    console.log(err);
})

const app = new express()
app.set("view engine", "pug")
app.set("views", "./views")
app.use("/static", express.static('./static/'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

app.get("/", product.fetchProducts)

app.get("/product/:p",async (req, res)=>{
    let prod = await product.findProduct(req.params.p)
    let products = await product.getProducts(prod[0].category)
    res.render("product", {
        prod: prod[0],
        products: products
    })
})

app.get("/category/:c",async (req, res)=>{
    if(req.params.c=="clothing"){
        let products = await product.getProducts("Clothing")
        res.render("category",{
            category: "Clothing and Fashion",
            image: "clothing.jpg",
            desc: "A wide range of clothing items and fashion accessories, including shirts, pants, dresses, shoes, and handbags.",
            products: products
        })
    }
    else if(req.params.c=="electronics"){
        let products = await product.getProducts("Electronics")
        res.render("category",{
            category: "Electronics",
            image: "electronics.jpg",
            desc: "A variety of electronic devices and gadgets, including laptops, smartphones, tablets, and home theater systems.",
            products: products
        })
    }
    else if(req.params.c=="homedecor"){
        let products = await product.getProducts("Home Decor")
        res.render("category",{
            category: "Home and Garden",
            image: "home_and_garden.jpg",
            desc: "Products for the home and garden, including furniture, bedding, home decor, outdoor equipment, and tools and hardware.",
            products: products
        })
    }
    else if(req.params.c=="beauty"){
        let products = await product.getProducts("Beauty")
        res.render("category",{
            category: "Beauty",
            image: "beauty.jpg",
            desc: "A variety of personal care and beauty products, including skincare products, hair care products, makeup, fragrances, and oral hygiene products.",
            products: products
        })
    }
    else if(req.params.c=="toys"){
        let products = await product.getProducts("Toys")
        res.render("category",{
            category: "Toys and Games",
            image: "toys.jpg",
            desc: "Toys and games for children and adults, including action figures, board games, dolls, puzzle games, and outdoor play equipment.",
            products: products
        })
    }
    else if(req.params.c=="sports"){
        let products = await product.getProducts("Sports")
        res.render("category",{
            category: "Sports and Outdoors",
            image: "sports.jpg",
            desc: "Products for sports and outdoor activities, including athletic clothing and footwear, outdoor gear, bikes and cycling equipment, athletic equipment, and golf clubs and accessories.",
            products: products
        })
    }
    else if(req.params.c=="health"){
        let products = await product.getProducts("Health")
        res.render("category",{
            category: "Health and Wellness",
            image: "health.jpg",
            desc: "Products related to health and wellness, including vitamins and supplements, fitness equipment, health food and snacks, natural remedies, and personal care products.",
            products: products
        })
    }
    else if(req.params.c=="food"){
        let products = await product.getProducts("Food")
        res.render("category",{
            category: "Food and Beverages",
            image: "food.jpg",
            desc: "Food and beverage items, including non-perishable pantry items, snack foods, beverages, fresh produce, and meat and seafood.",
            products: products
        })
    }
    else if(req.params.c=="books"){
        let products = await product.getProducts("Books")
        res.render("category",{
            category: "Books and Media",
            image: "books.jpg",
            desc: "Books, movies, TV shows, music, and podcasts, in various formats such as physical copies, digital downloads, and streaming services.",
            products: products
        })
    }
    else if(req.params.c=="furniture"){
        let products = await product.getProducts("Furniture")
        res.render("category",{
            category: "Home Decor",
            image: "furniture.jpg",
            desc: "Furniture and decorative items for the home, including tables, chairs, sofas, bedding, home decor, and outdoor furniture.",
            products: products
        })
    }
    else{
        res.status(400).send("No Category Found!")
    }
})

app.get("/about",(req, res)=>{
    res.render("about")
})

app.get("/contact",(req, res)=>{
    res.render("contact")
})
app.get("/signup",(req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("signup", {
            errors: []
        })
    }
    else{
        res.redirect("/")
    }
})

app.get("/login",(req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("login", {
            errors: []
        })
    }
    else{
        res.redirect("/")
    }
})

app.get("/cart", async (req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("login", {
            errors: []
        })
    }
    else{
        let cartitems = await cart.findCart(sess.userId);
        if(cartitems.length > 0){
        let cartProds = []
        for(let i = 0; i<cartitems.length; i++){
            let p = (await product.findProductById(cartitems[i].items[0].product))[0]
            cartProds[i] = {
                _id: p._id,
                name: p.name,
                price: p.price,
                category: p.category,
                image: p.image,
                description: p.description,
                quantity: cartitems[i].items[0].quantity
            }
        }
        res.render("cart",{ cartProds})
        }
        else{
            res.render("ecart");
        }
    }
})

app.get("/profile", async (req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("login", {
            errors: []
        })
    }
    else{
        let users = await user.findUser(sess.userId);
        let orderitems = await order.findOrders(sess.userId);
        if(orderitems.length > 0){
        let orderProds = []
        for(let i = 0; i<orderitems.length; i++){
            let p = (await product.findProductById(orderitems[i].items[0].product))[0]
            orderProds[i] = {
                _id: p._id,
                name: p.name,
                price: p.price,
                category: p.category,
                image: p.image,
                description: p.description,
                quantity: orderitems[i].items[0].quantity
            }
        }
        res.render("profile",{ 
            name: users[0].name,
            phone: users[0].phone,
            orderProds:orderProds
        })
        }
        else{
            res.render("eprofile",{ 
                name: users[0].name,
                phone: users[0].phone
            });
        }
    }
})

app.post("/buy",async (req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("login", {
            errors: []
        })
    }
    else{
        let cartitems = await cart.findCart(sess.userId);
        await order.insertOrders(cartitems)
        await cart.deleteCart(sess.userId);
        res.redirect("/profile")
    }
})

app.post("/addtocart", async (req, res)=>{
    sess = req.session;
    if(!sess.userId){
        res.render("login", {
            errors: []
        })
    }
    else{
        await cart.insertCart(sess.userId, req.body.prodid, req.body.quantity);
        let prod = await product.findProductById(req.body.prodid)
        let products = await product.getProducts(prod[0].category)
        res.render("product", {
            prod: prod[0],
            products: products
        })
    }
})

app.post("/signup", user.insertUser)
app.post("/login", user.verifyUser)
app.post("/search",async (req, res)=>{
    let prod = await product.findProduct(req.body.q)
    if(prod.length>0){
        let products = await product.getProducts(prod[0].category)
        res.render("product", {
            prod: prod[0],
            products: products
        })
    }
    else{
        res.status(400).send("No Product Found!")
    }
})

app.listen(8080, ()=>{
    console.log("Server Started...");
})