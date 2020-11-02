const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    Email: {
        type: String,
        required: true,
        unique: true
        
    },

    Username: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true
    },

    Register_Date: {
        type: Date,
        default: Date.now
    },

    Friends: [{userID: String, username: String}]

});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;