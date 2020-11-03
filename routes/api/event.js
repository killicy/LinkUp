const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Event = require('../../models/Event.js');


// route: POST api/createEvent
// creates event
// requires Title, Description, Author, Participants, Date_Start, Date_End
// private, does require token
router.post('/create', auth, (req, res) => {
    const {Title, Description, Author, Date_Start, Date_End} = req.body;
    
    if(!Title || !Description || !Author || !Date_End || !Date_Start)
        return res.status(400).json({ msg: 'Please enter all fields' });
    
    Event.findOne({ Title })
        .then(event => {
            if (event) return res.status(400).json({ msg: 'Event already exists' });
            console.log(req.user);
    
            const newEvent = new Event({
                Title,
                Description, 
                Author: req.user.Username,
                Participants: [{userID: req.user.id, username: req.user.Username}],  
                Date_Start, 
                Date_End,
                comments: [] 
            });

            newEvent.save()
                .then(event => {
                    res.json(newEvent);
                })
        }) 

});

// route: POST api/searchEvent
// searches for event
// optional Title, Description, Author, Participants, Date_Start, Date_End
// private, does require token
router.post('/search', auth, (req, res) => {

    Event.find({
            "$or": [
                { Title: { '$regex': req.body.search, '$options': 'i' } },
                { Description: { '$regex': req.body.search, '$options': 'i' } },
                { Author: { '$regex': req.body.search, '$options': 'i' } },
               // { Participants: { '$regex': req.body.search, '$options': 'i' } },
                //db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )
                { Date_Start: { '$regex': req.body.search, '$options': 'i' } },
                { Date_End: { '$regex': req.body.search, '$options': 'i' } }
            ]
        }).then((event) => {
            res.json(event);
        });


});

module.exports = router;
