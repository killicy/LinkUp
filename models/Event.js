const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({

    Title: {
        type: String,
        required: true,
    },

    Description: {
        type: String,
        required: true
    },

    Author: {
        type: String,
    },

    // store username and userID for less queries
    Participants: [{userID: String, username: String}],
       
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
        body: String, username: String, createdAt: String
    }]


});

const Event = mongoose.model('Event', eventSchema, 'events');
module.exports = Event;