const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({

    Email: {
        type: String,
        required: true
        
    },

    Username: {
        type: String,
        required: true,
        unique: true
    },

    Password: {
        type: String,
        required: true
    },

    Register_Date: {
        type: Date,
        default: Date.now
    }


});

const Register = mongoose.model('Register', registerSchema, 'users');
module.exports = Register;