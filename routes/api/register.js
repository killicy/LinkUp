const express = require('express');
const router = express.Router();
const Register = require('../../models/Register.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');

// route: POST api/register
// registers a new user, username=unique
router.post('/', (req, res) => {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check to see if user exists
    Register.findOne({ Username })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            // create user
            const newUser = new Register({
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

                            jwt.sign(

                                { id: user.id },
                                key.secretOrKey,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.Username,
                                            email: user.Email
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