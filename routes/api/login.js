const createToken = require('../../middleware/createToken');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const auth = require('../../middleware/auth');
const User = require('../../models/User.js');


// route: POST api/auth
// login user
// takes Username, Password
// public, does not require token
router.post('/', (req, res) => {
    const {Email, Password} = req.body;

    if(!Email || !Password){
        return res.status(400).json({ msg: 'Please enter all fields'});
    }

    //find username in DB
    User.findOne({ Email })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist'});

            //compare plain text password with hashed password
            bcrypt.compare(Password, user.Password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    // create token, expires in 60min
                    const token = createToken.createToken(user);
                        
                    res.json({ 
                        msg: "Logged in" ,
                        token
                    })

                    return token;

                })
        })

});

// GET api/auth/user
// header takes x-auth-token and token value
// returns user assigned to token
// private, requires token

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-Password')
        .then(user => res.json(user));
});


    
module.exports = router;

