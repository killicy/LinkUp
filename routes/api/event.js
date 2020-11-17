const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Event = require('../../models/Event.js');
var cookieParser = require('cookie-parser')
router.use(cookieParser())


// route: POST api/createEvent
// creates event
// requires Title, Description, Author, Participants, Date_Start, Date_End
// private, does require token
router.post('/create', auth, (req, res) => {
    const {Title, Description, Date_Start, Date_End} = req.body;
    
    if(!Title || !Description || !Date_End || !Date_Start)
        return res.status(400).json({ msg: 'Please enter all fields' });
    
    Event.findOne({ Title })
        .then(event => {
            if (event) return res.status(400).json({ msg: 'Event already exists' });
            console.log(req.user);
    
            const newEvent = new Event({
                Title,
                Description, 
                Author: {fName: req.user.fName, Username: req.user.Username, Email: req.user.Email},
                Participants: [{userID: req.user.id, Username: req.user.Username, Email: req.user.Email}],  
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
                { Date_Start: { '$regex': req.body.search, '$options': 'i' } },
                { Date_End: { '$regex': req.body.search, '$options': 'i' } }
            ]
        }).then((event) => {
            res.json(event);
        });


});

// route:  api/event/myEvents
// gets all events that logged in user is attending
// private, requires token
router.get('/myEvents', auth, (req, res) => {

    Event.find({ 'Participants.Username' : req.user.Username})
    
    .then((event) => {
        res.json(event);
    });
    console.log(req.user);

})

// route: Delete api/event/delete
// deletes event
// private, requires token

router.delete('/delete', auth, (req, res) => {
    const {Title} = req.body;
    Event.findOneAndDelete({Title})
    //Event.findOneAndDelete({Title}, (err, Event) => {

       // if(err)
         //   res.status(404).json( {msg: 'Event does not exist'});
        //else
          //  res.json({msg: 'Event deleted'});
       // });
        .then(event => event.remove().then( () => res.json( {msg: 'Event successfully deleted'})))
        .catch(err => res.status(404).json({msg: 'Event does not exist'}));
});

// route: post api/event/update/EventTitle
// updates event paramters
// private, requires token

router.post('/update/:Title', auth, (req, res) => {
    //const {Title} = req.body;
    Event.findOneAndUpdate( {Title: req.params.Title},
    //Event.findOneAndUpdate( {Title: 'test123'}, req.body, (err) => {
        req.body, {new: true}, (err, doc) => {
            if(err){
                console.log(err)
                res.status(404).json({msg: 'Event does not exist or title already exists'})
            }
            else{
                console.log(doc)
                res.json( {msg: 'Event successfully updated'})
            }
    });
});




module.exports = router;
