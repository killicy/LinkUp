
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

router.post('/register', (req, res) => {
    const { Email, Password, Username } = req.body;

    if(!Email || !Password || !Username) {
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
})
});

// route: POST api/user/login
// login user
// takes email, Password
// public, does not require token

router.post('/login', (req, res) => {
    const {Username, Password} = req.body;
    if(!Username || !Password){
        return res.status(400).json({ msg: 'Please enter all fields'});
    }
    // find username in DB
    User.findOne({ Username })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist'});

            //compare plain text password with hashed password
            bcrypt.compare(Password, user.Password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    // create token, expires in 60min, set it to a cookie
                    const token = createToken.createToken(user);
                    res.cookie('access_token', token,{
                      maxAge: 3600000,
                      httpOnly: true,
                      secure: true
                    })
                   return res.json({
                        msg: "Logged in" ,
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

router.get('/auth', auth,  (req, res) => {
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


router.post('/confirmation', (req, res) => {
  const token = req.body.token

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
  res.cookie('access_token', token,{
    maxAge: 3600000,
    httpOnly: true,
    secure: true
  })
  res.json({success: true, msg: req.user.Email});
});


router.get('/user', auth, (req, res) => {
  const token = createToken.createToken(req.user);
  res.cookie('access_token', token,{
    maxAge: 3600000,
    httpOnly: true,
    secure: true
  })
  res.json({success: true, username: req.user.Username});
});


router.get('/logOut', auth, (req, res) => {
  // Delete cookie if the user logs out
  res.cookie('access_token', false,{
    maxAge: 3600000,
    httpOnly: true
  })
  res.json({success: false});
});

// post api/user/addFriend
// adding a friend to the list
// private, requires token
router.post('/addFriend', auth, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.user.id});

        // get friend info from body
        const newFriend = {Username: req.body.Username, userID: req.body.userID, Email: req.body.Email}

        user.Friends.push(newFriend);
        user.save();

        return res.status(201).json(user.Friends);

    } catch (error) {
        console.error(error);
    }

});

// post api/user/addFriend
// adding a friend to the list
// private, requires token
router.post('/searchFriend', auth, async (req, res) => {

    const user = await User.findOne({_id: req.user.id})

    var condition = new RegExp(req.body.search);

    var result = user.Friends.filter(function (el) {
        return condition.test(el.Username);
        //return condition.test(el.fName || el.lName);
    })
    res.json(result);
});

// route: Delete api/user/delete
// deletes user by Email
// private, requires token

router.delete('/delete', auth, (req, res) => {
    const {Email} = req.body;
    User.findOneAndDelete({Email})
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

// route: post api/user/update/Email
// updates user info
// private, requires token
router.post('/update/:Email', auth, (req, res) => {
    User.findOneAndUpdate( {Email: req.params.Email},
        req.body, {new: true}, (err, user) => {
            if(err){
                console.log(err)
                res.status(404).json({msg: 'User does not exist or email is already taken'})
            }
            else{
                console.log(user)
                res.json( {msg: 'User successfully updated'})
            }
    });
});

router.get('/userInfo', auth, async(req, res) => {
  try{
    const user = await User.findOne({ Email: req.user.Email });
    const userEvents = await Event.find({ 'Participants.Email' : req.user.Email});
    const friends = user.Friends;
//    console.log(friends);
    const friendEvents = [];

    if(friends.length == 0)
    {
      return res.json({msg: 'You have no friends', Events: userEvents, friends: user.Friends, FriendEvents: friendEvents});
    }
    await Promise.all(friends.forEach(async friend => {
      Username = friend.Username;
      const events = await Event.find({ 'Participants.Username' : friend.Username });

      friendEvents.push({Username: events});
    }));
  }
  catch(err){
    console.log(err);
  }

  console.log("hellowrorld", friendEvents);
  res.json({Events: userEvents, friends: user.Friends, FriendEvents: friendEvents});
});





module.exports = router;
