const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Event = require('../../models/Event.js');


// route: POST api/createEvent
// creates event
// requires Title, Description, Author, Participants, Date_Start, Date_End
// private, does require token
router.post('/', auth, (req, res) => {
    const {Title, Description, Author, Date_Start, Date_End} = req.body;
    
    if(!Title || !Description || !Author || !Date_End || !Date_Start)
        return res.status(400).json({ msg: 'Please enter all fields' });
    
    Event.findOne({ Title })
        .then(event => {
            if (event) return res.status(400).json({ msg: 'Event already exists' });
    
            const newEvent = new Event({
                Title,
                Description, 
                Author, 
                Participants, 
                Date_Start, 
                Date_End, 
                comments
            });

            newEvent.save()
                .then(event => {
                    res.json(newEvent);
                })
        }) 



});

module.exports = router;
