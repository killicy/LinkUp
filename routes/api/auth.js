const express = require('express');
const router = express.Router();
const Register = require('../../models/Register.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const auth = require('../../middleware/auth');

// route: POST api/auth
// authenticate user
router.post('/', auth, (req, res) => {
    const {Username, Password} = req.body;

    if(!Username || !Password){
        return res.status(400).json({ msg: 'Please enter all fields'});
    }

    Register.findOne({ Username })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist'});

            bcrypt.compare(Password, user.Password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(

                        { id: user.id },
                        key.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                msg: "Logged in",
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

});

// GET api/auth/user
// header takes x-auth-token and token value
// returns user assigned to token

router.get('/user', auth, (req, res) => {
    Register.findById(req.user.id)
        .select('-Password')
        .then(user => res.json(user));
});


    
module.exports = router;