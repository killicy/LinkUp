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
    var {Title, Description, Date_Start, Date_End, Event_Image} = req.body;

    if(!Title || !Description || !Date_End || !Date_Start)
        return res.status(400).json({ msg: 'Please enter all fields', success: false});
    if(!Event_Image){
      Event_Image = "pdu4zotrzptkew0g5gxe"
    }

    Event.findOne({ Title })
        .then(event => {
            if (event) return res.status(400).json({ msg: 'Event already exists', success: false});

            const newEvent = new Event({
                Title,
                Description,
                Author: { Username: req.user.Username, Email: req.user.Email, Profile_pic: req.user.Profile_pic},
                Participants: [{ Username: req.user.Username, Email: req.user.Email, Profile_pic: req.user.Profile_pic}],
                Date_Start,
                Date_End,
                comments: [],
                Event_Image

            });

            newEvent.save()
                .then(event => {
                    res.json({newEvent, success: true});
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

})

router.post('/participants', auth, async(req, res) => {
  const event = await Event.findOne({ Title: req.body.Title });
  if (!event) {
    res.json({success: false});
    return;
  }
  res.json({success: true, participants: event.Participants});
})

// route: Delete api/event/delete
// deletes event
// private, requires token

router.delete('/delete', auth, async (req, res) => {
    const {Title} = req.body;
    
    const event = await Event.findOne({Title});
    
    if (event.Author.Username !== req.user.Username) {
        const deleteParticipant = ({  Username: req.user.Username, Email: req.user.Email, Profile_pic: req.user.Profile_pic});

        event.Participants.pull(deleteParticipant);
        event.save();
        
        return res.json( {msg: 'Event successfully unsubscribed'})
    }
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
                res.status(404).json({msg: 'Event does not exist or title already exists'})
            }
            else{
                res.json( {msg: 'Event successfully updated'})
            }
    });
});


// route: post api/event/update/addParticipant
// takes event title, adds logged in user to it
// private, requires token
router.post('/addParticipant', auth, async(req, res) => {

    const event = await Event.findOne({ Title: req.body.Title });
    
    event.Participants.forEach(el => {
        if (el.Username === req.user.Username) {
            return res.status(400).json({msg: 'Participant exists'});
        }
    });
    
    const newParticipant = ({ Username: req.user.Username, Email: req.user.Email, Profile_pic: req.user.Profile_pic});

    event.Participants.push(newParticipant);
    event.save();


    res.json(event);

});

// route: post api/event/update/removeParticipant
// takes event title, deletes logged in user from it
// private, requires token
router.post('/removeParticipant', auth, async(req, res) => {

    const event = await Event.findOne({ Title: req.body.Title });
    const deleteParticipant = ({  Username: req.user.Username, Email: req.user.Email, Profile_pic: req.user.Profile_pic});

    event.Participants.pull(deleteParticipant);
    event.save();

    // Node.findById(req.params.id)
    // .then(node => {
    //   node.configuration.links.pull(req.params.linkId)
    //   return node.save()
    // .then(node => res.send(node.configuration.links))

    res.json(event);

});

// route: post api/event/changeEventPic
// takes URL, title
// private, requires token
router.post('/changeEventPic', auth, async (req, res) => {

    try {
        const event = await Event.findOne({ Title: req.body.Title });

        event.Event_Image = req.body.URL;
        event.save();


        res.json({ msg: "Event_Image updated!" });

    } catch (error) {
        res.json({ error });
    }
})

// route: post api/event/attendingEvent
// takes Title, finds if logged in user is a participant
// private, requires token
router.post('/attendingEvent', auth, async (req, res) => {

    try {
        const event = await Event.findOne({ Title: req.body.Title, 'Participants.Username' : req.user.Username });

        if(event == null){
            res.json({ msg: "You are not attending this event or it does not exist", success: false});
            return;
        }
        res.json({ msg: "You are attending this event!", success: true});

    } catch (error) {
        res.json({ error, success: false});
    }
})

module.exports = router;
