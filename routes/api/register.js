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
    User.findOne({ Username })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

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

                            // create token
                            // display new user info
                            jwt.sign(

                                { 
                                    id: user.id,
                                    Email: user.Email,
                                    Username: user.Username
                                
                                },
                                key.secretOrKey,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            Username: user.Username,
                                            Email: user.Email
                                        }
                                    })
                                }
                            )
                        })
                })
            })
        })
});


module.exports = router;

