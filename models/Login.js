const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    Username: {
        type: String
    },
    Password: {
        type: String
    },
});

const Login = mongoose.model('Login', loginSchema, 'users');
module.exports = Login;
