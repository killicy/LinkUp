const express = require('express');
const { db } = require('../../models/Event.js');
const router = express.Router();
//const auth = require('../../middleware/auth');
const Event = require('../../models/Event.js');


// route: POST api/searchEvent
// searches for event
// optional Title, Description, Author, Participants, Date_Start, Date_End
// private, does require token
router.post('/',  (req, res) => {



    Event.find({
            "$or": [
                { Title: { '$regex': req.body.search, '$options': 'i' } },
                { Description: { '$regex': req.body.search, '$options': 'i' } },
                { Author: { '$regex': req.body.search, '$options': 'i' } },
                { Participants: { '$regex': req.body.search, '$options': 'i' } },
                { Date_Start: { '$regex': req.body.search, '$options': 'i' } },
                { Date_End: { '$regex': req.body.search, '$options': 'i' } },
                //{ comments: { '$regex': req.body.search, '$options': 'i' } }
            ]
        }).then((event) => {
            res.json(event);
        });


});

module.exports = router;