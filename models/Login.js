const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    loginUsername: {
        type: String
    },
    loginPassword: {
        type: String
    },
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
