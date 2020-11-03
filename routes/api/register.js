const express = require('express');
const router = express.Router();
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');

// route: POST api/register
// registers a new user, username=unique
// public, does not require token
router.post('/', (req, res) => {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check to see if user exists
    User.findOne({ Email })
        .then(user => {
            if (user) return res.status(400).json({msg: 'Email already exists!'  });

            // create user
            const newUser = new User({
                Username,
                Email,
                Password,
            });

            // Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.Password, salt, (err, hash) => {
                    if (err) throw err;

                    newUser.Password = hash;
                    newUser.save()
                        .then(user => {

                            res.json({
                                msg: 'Registered!' 
                            })
                        }
                    )
                })
            })
        })
});


module.exports = router;

