const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    Email: {
        type: String,
        required: true,
        unique: true 
    },

    // Username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    fName: {
        type: String,
        required: true,
    },

    lName: {
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

    Friends: [{userID: String, fName: String, lName: String, Email: String}],
    
    Profile_pic: {
        type: String
    },

    isVerified: {
        type: Boolean
    }
    
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;