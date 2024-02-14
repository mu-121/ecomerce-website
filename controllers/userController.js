const User = require("../models/userModel")
const validator = require('validator')
const insertUser = async (req, res) => {
    const { name, email, password, address, phone } = req.body;
  
    // Validate the form data
    const errors = [];
    if (!name || !validator.isLength(name, { min: 2, max: 100 })) {
      errors.push({ message: 'Please enter a valid name' });
    }
    if (!email || !validator.isEmail(email)) {
      errors.push({ message: 'Please enter a valid email address' });
    }
    if (!password || !validator.isLength(password, { min: 8, max: 100 })) {
      errors.push({ message: 'Please enter a valid password' });
    }
    if (!address || !validator.isLength(address, { min: 5, max: 200 })) {
      errors.push({ message: 'Please enter a valid address' });
    }
    if (!phone || !validator.isMobilePhone(phone)) {
      errors.push({ message: 'Please enter a valid phone number' });
    }
  
    if (errors.length) {
    //   Form data is invalid
      return res.render('signup', { errors });
    }
  
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ message: 'This email is already in use' });
      return res.render('signup', { errors });
    }
  
    // Create a new user
    const user = new User({ name, email, password, address, phone });
    await user.save(); // save the user to the database
  
    // Redirect the user to the login page
    res.redirect('login', {
        errors: []
    });
  }

const verifyUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate the form data
    const errors = [];
    if (!email || !validator.isEmail(email)) {
      errors.push({ message: 'Please enter a valid email address' });
    }
    if (!password || !validator.isLength(password, { min: 8, max: 100 })) {
      errors.push({ message: 'Please enter a valid password' });
    }
  
    if (errors.length) {
      // Form data is invalid
      return res.render('login', { errors });
    }
  
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      errors.push({ message: 'This email does not exist' });
      return res.render('login', { errors });
    }
  
    // Check if the password is correct
    if (password != user.password) {
      errors.push({ message: 'Incorrect password' });
      return res.render('login', { errors });
    }
  
    // Save the user's ID to the session
    req.session.userId = user._id;
  
    // Redirect the user to the dashboard
    res.redirect('/');
  }

const findUser = async (userId) => {
    let users = await User.find({ userId })
    return users
}

module.exports = {insertUser, verifyUser, findUser};
