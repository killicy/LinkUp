const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({

    Title: {
        type: String,
        required: true,
        unique: true
    },

    Description: {
        type: String,
        required: true
    },

    // Description : String 

    Author: {
        userID: String,
        Username: String,
        Email: String
    },

    // store username and userID for less queries
    // Participants: [{ type: String }],
    Participants: [{_id: false, Username: String, Email: String}],
       
    Date_Added: {
        type: Date,
        default: Date.now
    },

    Date_Start: {
        type: String,
        required: true
    },

    Date_End: {
        type: String,
        require: true
    },

    comments: [{
        body: String,  Username: String, createdAt: String
    }]


});

const Event = mongoose.model('Event', eventSchema, 'events');
module.exports = Event;