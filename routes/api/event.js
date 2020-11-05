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
    
    if(!Title || !Description || !Date_End || !Date_Start)
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

// route: post api/event/update
// updates event
// private, requires token

router.post('/update/:Title', auth, (req, res) => {
    //const {Title} = req.body;
    Event.findOneAndUpdate( {Title: req.params.Title},
    //Event.findOneAndUpdate( {Title: 'test123'}, req.body, (err) => {
        req.body, (err) => {
            if(err){
                console.log(err)
                res.status(404).json({msg: 'Event does not exist or title already exists'})
            }
            else{
                console.log("Event updated")
                res.json( {msg: 'Event successfully updated'})
            }
    });

        //.then(event => event.remove().then( () => res.json( {msg: 'Event successfully update'})))
        //.catch(err => res.status(404).json({msg: 'Event does not exist'}));
});


module.exports = router;
