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

    if(!Email || !Password || !Username) {
      console.log("help");
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check to see if user exists
    User.findOne({ Email })
        .then(user => {
            if (user) return res.status(400).json({msg: 'Email already exists!' });
    User.findOne({ Username })
        .then(user => {
            if (user) return res.status(400).json({msg: 'Username already exists!' });

            // create user
            const newUser = new User({
                Email,
                Password,
                Username,
                Profile_pic: "esiurmc4vzfadgrmumm7"
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
            try{
              const token = createToken.createToken(newUser)
              res.cookie('linkUpUser', newUser.Username,{
                httpOnly: true,
                secure: true
              })
              sendEmail(newUser.Email, templates.confirm(newUser.Username, token))
            }
            catch(err){
              console.log(err)
            }
        })
    });
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
                        //secure: true
                    })
                    return res.json({
                        msg: "Logged in",
                        Username: user.Username,
                        Email: user.Email,
                        Friends: user.Friends,
                        Profile_pic: user.Profile_pic,
                        Description: user.Description,
                        success: true
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

router.get('/confirmationEmail', auth,  (req, res) => {
    const token = createToken.createToken(req.user);
    console.log(req.user.Email)
    sendEmail(req.user.Email, templates.confirm(req.user.Username, token));
    res.json({success: true})
});

router.post('/passwordEmail', (req, res) => {
    sendEmail(req.body.email, templates.password(req.body.username));
    res.json({success: true})
});


router.post('/confirmation', (req, res) => {
  const token = req.body.token;
  // Check for token
  if(!token){
      res.status(401).json({ msg: 'This page doesn\'t exist', success: false});
      return;
  }
  try{
      // Verify token
      const decoded = jwt.verify(token, key.secretOrKey);
      res.json({msg: 'Welcome to LinkUp ' + decoded.Username +', you are now verified!!!',success: true})
  } catch(e) {
      res.status(400).json({ msg: 'This page doesn\'t exist', success: false});
  }
});

router.get('/isLoggedIn', auth, (req, res) => {
    // Create new token and cookie if the user is still logged in
    const token = createToken.createToken(req.user);
    res.cookie('access_token', token, {
        maxAge: 3600000,
        httpOnly: true,
        //secure: true
    })
    res.json({ success: true, msg: req.user.Username });
});

router.get('/user', auth, (req, res) => {
  const token = createToken.createToken(req.user);
  res.cookie('access_token', token,{
    maxAge: 3600000,
    httpOnly: true,
    //secure: true
  })
  res.json({success: true, username: req.user.Username});
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

        if(newFriend == null){
            res.json({msg: "User not found"});
            return;
        }

        user.Friends.push(newFriend);
        user.save();

        return res.status(201).json({success: true});

    } catch (error) {
        console.error(error);
    }

});

// post api/user/addFriend
// regex search on logged in users friends list
// private, requires token
router.post('/searchFriend', auth, async (req, res) => {
    if(!req.body.search){
        res.json({ msg: "Please enter search criteria", user: []});
    }
    
    const user = await User.findOne({_id: req.user.id})

    var condition = new RegExp(req.body.search);

    var result = user.Friends.filter(function (el) {
        return condition.test(el.Username);
        //return condition.test(el.fName || el.lName);
    })
    

    res.json(result);

});


router.post('/searchUsers', auth, (req, res) => {

    if(!req.body.search){
        res.json({ msg: "Please enter search criteria", user: []});
    }

    User.find({
        "$or": [
            { Username: { '$regex': req.body.search, '$options': 'i' } },
            { Email: { '$regex': req.body.search, '$options': 'i' } }
        ]
    }).select("-Password")
    .then((user) => {
        res.json({user: user});
        console.log(user);
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
router.get('/userInfo', auth, async(req, res) => {
    try{
        const user = await User.findOne({ Email: req.user.Email });
        const userEvents = await Event.find({ 'Participants.Email' : req.user.Email});
        const friends = user.Friends;
        //    console.log(friends);
        if(friends.length == 0) {
            return res.json({msg: 'You have no friends', Events: userEvents, friends: user.Friends});
        }

        // Hold all my promises.
        let promises = [];
        friends.forEach( (friend) => {

            let generatePromise = async () => {
                const Username = friend.Username;
                const events = await Event.find({ 'Participants.Username' : friend.Username });

                let retVal = {}
                retVal[Username] = events;

                // Promise is resolved and returns the Events object for this friend.
                return retVal;
            };

            // Create the promise by calling the asynchronous function, and push it into our promises array.
            promises.push(generatePromise());
        });

        // Wait for all promises to complete, and aggregate them into `all`.
        await Promise.all(promises).then( (all) => res.json({ UserEvents: userEvents, Friends: friends, FriendEvents: all}))
    }

    catch(err) {
        console.log(err);
    }

});

// route: post api/user/usernameInfo
// takes username, displays that users info in accordance to your relationship
// private, requires token
router.post('/usernameInfo', auth, async (req, res) => {

    const loggedUser = await User.findOne({ Username: req.user.Username });
    const findUser = await User.findOne({ Username: req.body.Username });
    const events = await Event.find({ 'Participants.Username': req.body.Username }).sort('Date_Added');
    console.log(events);
    const friends = [];


    console.log(friends.includes(req.body.Username));

    if (findUser == null) {
        res.json({ msg: "Username not found", UserEvents: [], Friends: [], FriendEvents: [], success: false, user: {Username: 'placeholder'}});
        return;
    }

    if (findUser.Username == loggedUser.Username) {
        const friends = loggedUser.Friends;
        let promises = [];
        friends.forEach( (friend) => {

            let generatePromise = async () => {
                const Username = friend.Username;
                const events = await Event.find({ 'Participants.Username' : friend.Username }).sort('Date_Added');

                let retVal = {}
                retVal[Username] = events;

                // Promise is resolved and returns the Events object for this friend.
                return retVal;
            };

            // Create the promise by calling the asynchronous function, and push it into our promises array.
            promises.push(generatePromise());
        });

        // Wait for all promises to complete, and aggregate them into `all`.
        await Promise.all(promises).then( (all) => {
          console.log(all);
           res.json({ UserEvents: events, Friends: friends, FriendEvents: all, success: true, addFriend: false, friend: false, Username: findUser.Username, Email: findUser.Email, Profile_pic: findUser.Profile_pic, user: findUser})
        })
        return;
    }

    loggedUser.Friends.forEach(async friend => {

        friends.push(friend.Username)

    })

    if (friends.includes(req.body.Username)) {
        const friends = findUser.Friends;
        let promises = [];
        friends.forEach( (friend) => {

            let generatePromise = async () => {
                const Username = friend.Username;
                const events = await Event.find({ 'Participants.Username' : friend.Username }).sort('Date_Added');

                let retVal = {}
                retVal[Username] = events;

                // Promise is resolved and returns the Events object for this friend.
                return retVal;
            };

            // Create the promise by calling the asynchronous function, and push it into our promises array.
            promises.push(generatePromise());
        });

        // Wait for all promises to complete, and aggregate them into `all`.
        await Promise.all(promises).then( (all) => res.json({UserEvents: events, Friends: friends, FriendEvents: all, success: true, addFriend: false, friend: true, Username: findUser.Username, Email: findUser.Email, Profile_pic: findUser.Profile_pic, user: findUser}))
        return;
    }
    else{
      res.json({msg: "Add this user to see their posts.", UserEvents: [], Friends: [], FriendEvents: [], success: true, addFriend: true, friend: true, Username: findUser.Username, Email: findUser.Email, Profile_pic: findUser.Profile_pic, user: findUser})
    }


})

// route: post api/user/changeProfilePic
// takes URL
// creates a new token so that user does not have to logout/login
// private, requires token
router.post('/changeProfilePic', auth, async (req, res) => {

    const user = await User.findOne({ Username: req.user.Username });

    user.Profile_pic = req.body.Url;
    user.save();
    const token = createToken.createToken(user);
    res.cookie('access_token', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true
    })

    res.json({ msg: "Profile URL updated!", success: true});

});


// route: get api/user/verifyUser
// takes token, sets user isVerified to true
// private, requires token
router.get('/verifyUser', auth, async(req, res) => {

    try {
        const user = await User.findOne({ Username: req.user.Username });

        user.isVerified = true;
        user.save();

        res.json({ msg: "User is now verified!" });

    } catch (error) {
        res.json({ error });
    }



});

// route: get api/user/getUser
// takes token, returns user
// private, requires token
router.get('/getUser', auth, async(req, res) => {

    try {
        const user = await User.findOne({ Username: req.user.Username }).select('-Password');
        res.json({ user });
        
    } catch (error) {
        res.json({ error });
    }
});

// route: get api/user/updateDescription
// takes Description, updates user desctiption
// private, requires token
router.post('/updateDescription', auth, async(req, res) => {

    try {
        const user = await User.findOne({ Username: req.user.Username});
        user.Description = req.body.Description;

        user.save();

        res.json({ msg: "Description updated", Description: user.Description });
        
    } catch (error) {
        res.json({ error });
    }
})

// route: get api/user/updateUsername
// takes Username, updates user Username
// private, requires token
router.post('/updateUsername', auth, async(req, res) => {

    try {
        const user = await User.findOne({ Username: req.user.Username});
        user.Username = req.body.Username;

        user.save();

        res.json({ msg: "Username updated", Username: user.Username });
        
    } catch (error) {
        res.json({ error });
    }
})

// route: get api/user/forgotPassword
// takes Password, updates user Password
// private, requires token
router.post('/forgotPassword', auth, async(req, res) => {

    const user = await User.findOne({ Username: req.user.Username});
    user.Password = req.body.Password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.Password, salt, (err, hash) => {
            if (err) throw err;

            user.Password = hash;
            user.save()
                .then(user => {
                    res.json({
                        msg: 'Password updated!',
                        success: true,
                        Username: user.Username
                    })
                })

        })
    })
})

module.exports = router;
