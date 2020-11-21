const createToken = require('../../middleware/createToken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const auth = require('../../middleware/auth');
const User = require('../../models/User.js');
var cookieParser = require('cookie-parser')
router.use(cookieParser())
const sendEmail = require('../../middleware/email');
const msgs = require('../../middleware/confirmationMsgs');
const templates = require('../../middleware/emailTemplate');
const Event = require('../../models/Event.js');



// route: POST api/user/register
// registers a new user, email=unique
// public, does not require token
router.post('/register', (req, res) => {
    const { Email, Password, Username } = req.body;

    if (!Email || !Password || !Username) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check to see if user exists
    User.findOne({ Email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'Email already exists!' });
            User.findOne({ Username })
                .then(user => {
                    if (user) return res.status(400).json({ msg: 'Username already exists!' });

                    // create user
                    const newUser = new User({
                        Email,
                        Password,
                        Username
                    });

                    // Create salt and hash
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.Password, salt, (err, hash) => {
                            if (err) throw err;

                            newUser.Password = hash;
                            newUser.save()
                                .then(user => {
                                    res.json({
                                        msg: 'Registered!',
                                        success: true,
                                        Username: user.Username
                                    })
                                }
                                )
                        })
                    })
                    // New code to send email upon creation of account
                    // try{
                    //   sendEmail(newUser.Email, templates.confirm(newUser.Username))
                    // }
                    // catch(err){
                    //   console.log(err)
                    // }
                })
        })
});




// route: POST api/user/login
// login user
// takes email, Password
// public, does not require token
router.post('/login', (req, res) => {
    const { Username, Password } = req.body;
    if (!Username || !Password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // find username in DB
    User.findOne({ Username })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            //compare plain text password with hashed password
            bcrypt.compare(Password, user.Password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    // create token, expires in 60min, set it to a cookie
                    const token = createToken.createToken(user);
                    res.cookie('access_token', token, {
                        maxAge: 3600000,
                        httpOnly: true,
                        secure: true
                    })
                    return res.json({
                        msg: "Logged in",
                        Username: user.Username,
                        Email: user.Email,
                        Friends: user.Friends,
                        success: true
                        // add link to profile pic
                    })

                })
        })

});



// GET api/user/auth
// header takes x-auth-token and token value
// returns user assigned to token
// private, requires token

router.get('/auth', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-Password')
        .then(user => res.json(user));
});



router.get('/isLoggedIn', auth, (req, res) => {
    // Create new token and cookie if the user is still logged in
    const token = createToken.createToken(req.user);
    res.cookie('access_token', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true
    })
    res.json({ success: true, msg: req.user.Username });
});


router.get('/logOut', auth, (req, res) => {
    // Delete cookie if the user logs out
    res.cookie('access_token', false, {
        maxAge: 3600000,
        httpOnly: true
    })
    res.json({ success: false });
});


// post api/user/addFriend
// adding a friend to the list
// private, requires token
router.post('/addFriend', auth, async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.user.id });

        // get friend info from body
        const newFriend = await User.findOne({ Username: req.body.Username })

        user.Friends.push(newFriend);
        user.save();

        return res.status(201).json(user.Friends);

    } catch (error) {
        console.error(error);
    }

});




// post api/user/addFriend
// regex search on logged in users friends list
// private, requires token
router.post('/searchFriend', auth, async (req, res) => {

    const user = await User.findOne({ _id: req.user.id })

    var condition = new RegExp(req.body.search);

    var result = user.Friends.filter(function (el) {
        return condition.test(el.Username);
        //return condition.test(el.fName || el.lName);
    })

    res.json(result);

});


// route: POST api/searchUsers
// searches for users
// optional username, email
// private, does require token
router.post('/searchUsers', auth, (req, res) => {

    User.find({
        "$or": [
            { Username: { '$regex': req.body.search, '$options': 'i' } },
            { Email: { '$regex': req.body.search, '$options': 'i' } }
        ]
    }).then((user) => {
        res.json(user);
    });


});

// route: Delete api/user/delete
// deletes user by Email
// private, requires token

router.delete('/delete', auth, (req, res) => {
    const { Email } = req.body;
    User.findOneAndDelete({ Email })
        .then(user => user.remove().then(() => res.json({ msg: 'User successfully deleted' })))
        .catch(err => res.status(404).json({ msg: 'User does not exist' }));
});

// route: post api/user/update/Email
// updates user info
// private, requires token
router.post('/update/:Email', auth, (req, res) => {
    User.findOneAndUpdate({ Email: req.params.Email },
        req.body, { new: true }, (err, user) => {
            if (err) {
                console.log(err)
                res.status(404).json({ msg: 'User does not exist or email is already taken' })
            }
            else {
                console.log(user)
                res.json({ msg: 'User successfully updated' })
            }
        });
});

// route: post api/user/userInfo
// displays logged in users friends and events
// // private, requires token
router.get('/userInfo', auth, async (req, res) => {

    //find logged in user
    const user = await User.findOne({ Email: req.user.Email });

    //find logged in users events
    const userEvents = await Event.find({ 'Participants.Email': req.user.Email });

    //logged in users friends
    const friends = user.Friends;
    //    console.log(friends);
    const friendEvents = [];

    //for each friend, we have their info{}. info.username, info.events.
    // info.events is an array of events that the friend is going to 
    friends.forEach(async friend => {

        const info = {};

        info.Username = friend.Username;
        const events = await Event.find({ 'Participants.Username': friend.Username });

        info.events = [];

        //for each event the friend is going to, push the events info into info.events
        events.forEach(event => {

            info.events.push(event)
            //console.log(info)
            //info.events.push({Author: event.Author, Description: event.Description, Title: event.Title, Participants: event.Participants})
            //console.log(event.Participants);
            //arrayEvents.push({Author: event.Author});
        })


        //console.log(info.events.Participants);

        // push the info{username, events} to an array of the logged in users friend events
        friendEvents.push(info);
        //res.json({ fevents: info});
        //res.json({myevents: userEvents});

        console.log("hellowrorld", friendEvents);



    });

    //console.log("**********************", friendEvents);

    // res.json({Events: userEvents, friends: user.Friends, FriendEvents: friendEvents});
    res.json({ Events: userEvents, friends: user.Friends });


});



// route: post api/user/usernameInfo
// takes username, displays that users info in accordance to your relationship
// private, requires token
router.post('/usernameInfo', auth, async (req, res) => {

    const loggedUser = await User.findOne({ Username: req.user.Username });
    const findUser = await User.findOne({ Username: req.body.Username });
    const events = await Event.find({ 'Participants.Username': req.body.Username });

    const friends = [];


    console.log(friends.includes(req.body.Username));

    if (findUser == null) {
        res.json({ msg: "Username not found" });
        return;
    }

    if (findUser.Username == loggedUser.Username) {
        res.json({ User: loggedUser, Events: events })
        return;
    }


    loggedUser.Friends.forEach(async friend => {

        friends.push(friend.Username)

    })

    if (friends.includes(req.body.Username)) {
        res.json({ User: findUser, Events: events })
        return;
    }

    res.json({ Username: findUser.Username, Email: findUser.Email });

})


module.exports = router;
