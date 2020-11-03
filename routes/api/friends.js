const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Event = require('../../models/Event.js');


// adding a friend to the list 
router.post('/', auth, (req, res) => {

    const friends = req.body.friends;

    // get friend info from body
    const newFriend = {username: req.body.username, userID: req.body.userID}

    // add
    friends.push(newFriend);

    // save to database
    await User.findOneAndUpdate({_id: req.user.id}, {friends: friends})

    return res.json({friends});
});