const express = require('express');
const router = express.Router();

const Login = require('../models/Login');
const Register = require('../models/Register.js');


router.get('/message', (req, res) => {
res.send({message: "Hello from Express Mongo backend."});
});


// router.post('/login', async (req, res) => {

// const user = await User.findOne({email: req.body.email})

// if(!user) {return res.status(400).json({error: "user doesnt exist"})};

// if(user.password ===)
// })

router.post('/register', (req, res) => {

const newUser = new Register({
Email: req.body.Email,
Username: req.body.Username,
Password: req.body.Password,
Date: req.body.Date
});

Register.exists({Username: req.body.Username}, function(err, doc) {
if(doc){
res.send({message: "Username Already Exists!"});
}
else{
newUser.save().then(user => res.json(user));
res.send({message: "Account created"});
}
});


});


// Example
// router.get('/todos', function(req, res) {
//     Login.find(function(err, todos) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(todos);
//         }
//     });
// });

module.exports = router;
