const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Invalid phone number'
        }
    }
});

module.exports = mongoose.model('User', userSchema);