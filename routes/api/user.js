const createToken = require('../../middleware/createToken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const auth = require('../../middleware/auth');
const User = require('../../models/User.js');


// route: POST api/user/register
// registers a new user, username=unique
// public, does not require token
router.post('/register', (req, res) => {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check to see if user exists
    User.findOne({ Email })
        .then(user => {
            if (user) return res.status(400).json({msg: 'Email already exists!' });

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




// route: POST api/user/login
// login user
// takes email, Password
// public, does not require token
router.post('/login', (req, res) => {
    const {Email, Password} = req.body;

    if(!Email || !Password){
        return res.status(400).json({ msg: 'Please enter all fields'});
    }

    // find username in DB
    User.findOne({ Email })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist'});

            //compare plain text password with hashed password
            bcrypt.compare(Password, user.Password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    // create token, expires in 60min
                    const token = createToken.createToken(user);
                        
                   return res.json({ 
                        msg: "Logged in" ,
                        Username: user.Username,
                        Email: user.Email,
                        Friends: user.Friends,
                        // add link to profile pic
                        token
                    })

                })
        })

});



// GET api/user/auth
// header takes x-auth-token and token value
// returns user assigned to token
// private, requires token

router.get('/auth', auth,  (req, res) => {
    User.findById(req.user.id)
        .select('-Password')
        .then(user => res.json(user));
});




// post api/user/addFriend
// adding a friend to the list 
// private, requires token
router.post('/addFriend', auth, async (req, res) => {

    try {

        const friends = req.body.Friends;

        // get friend info from body
        const newFriend = {Username: req.body.Username, userID: req.body.userID}
    
        // add
        friends.push(newFriend);
    
        // save to database
        const user = await User.findOne({_id: req.user.id})
        user.Friends = friends
        console.log(user.Friends);
        await user.save()
        return res.status(201).json({friends});
        
    } catch (error) {
        console.error(error);
    }

});




// post api/user/addFriend
// regex search on logged in users friends list
// private, requires token
router.post('/searchFriend', auth, async (req, res) => {

    const user = await User.findOne({_id: req.user.id})
    
    var condition = new RegExp(req.body.search);
    
    var result = user.Friends.filter(function (el) {
        return condition.test(el.Username);
    })
    
    res.json(result);

})

// route: Delete api/user/delete
// deletes user by username
// private, requires token

router.delete('/delete', auth, (req, res) => {
    const {Username} = req.body;
    User.findOneAndDelete({Username})
        .then(user => user.remove().then( () => res.json( {msg: 'User successfully deleted'})))
        .catch(err => res.status(404).json({msg: 'User does not exist'}));
});

// route: post api/user/update/Username
// updates user info
// private, requires token
router.post('/update/:Username', auth, (req, res) => {
    User.findOneAndUpdate( {Username: req.params.Username},
        req.body, {new: true}, (err, user) => {
            if(err){
                console.log(err)
                res.status(404).json({msg: 'User does not exist or username/email is already taken'})
            }
            else{
                console.log(user)
                res.json( {msg: 'User successfully updated'})
            }
    });
});


module.exports = router;