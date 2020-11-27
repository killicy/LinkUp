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
        required: true,
        unique: true
    },

    Password: {
        type: String,
        required: true,
        select: true // This needs to be 'true' for the select on `login` to grab and compare with bcrypt.
    },

    Register_Date: {
        type: Date,
        default: Date.now
    },

    Friends: [{ Username: String, Email: String, Profile_pic: String }],
    
    Profile_pic: {
        type: String,
        required: true,
        default: "https://www.google.com/search?q=default+user+image&rlz=1C1CHBF_enUS821US821&sxsrf=ALeKk03Zr5acFXfU-nPU0vm96VLqxHgOxQ:1605974142603&tbm=isch&source=iu&ictx=1&fir=AK6Do3uj3k0n4M%252Ce6gEsA9KT4s-2M%252C_&vet=1&usg=AI4_-kQMHliGcFLwe2qF9l7n3DYe0Sc7OQ&sa=X&ved=2ahUKEwjt6qby_5PtAhVtu1kKHeYtC_wQ9QF6BAgLEFU&biw=1920&bih=937#imgrc=lZgxKlN5po1QRM"
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    
    Description: {
        type: String,
        
        default: ""
    }
    
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
