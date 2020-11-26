
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
  Participants: [{_id: false, Username: String, Email: String, Profile_pic: String}],

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

  Event_Image: {
      type: String,
      required: true,
      default: "https://www.google.com/search?q=default+user+image&rlz=1C1CHBF_enUS821US821&sxsrf=ALeKk03Zr5acFXfU-nPU0vm96VLqxHgOxQ:1605974142603&tbm=isch&source=iu&ictx=1&fir=AK6Do3uj3k0n4M%252Ce6gEsA9KT4s-2M%252C_&vet=1&usg=AI4_-kQMHliGcFLwe2qF9l7n3DYe0Sc7OQ&sa=X&ved=2ahUKEwjt6qby_5PtAhVtu1kKHeYtC_wQ9QF6BAgLEFU&biw=1920&bih=937#imgrc=lZgxKlN5po1QRM"
  },

  comments: [{
      body: String,  Username: String, createdAt: String
  }]


});

const Event = mongoose.model('Event', eventSchema, 'events');
module.exports = Event;
