// for jwt
// npm i jsonwebtoken bcryptjs
// npm i nodemailer   
// npm i cookie-parser

require('dotenv').config({path: './client/.env'});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const fs = require('fs');

const keys = require('./config/keys');
const cors = require('cors');

const app = express();

var whitelist = [process.env.REACT_APP_CLIENT_URL, 'https://app.swaggerhub.com', 'https://localhost:3000']

// Bodyparser Middleware
app.use(express.json());

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

// Cross Origin Requests
app.use(cors(corsOptions));

// DB Config
const dbConnection = keys.mongoURI;

// Connect to Mongo
mongoose
  .connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/event', require('./routes/api/event'));
app.use('/static', express.static(__dirname + '/static'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE ? process.env.SSL_KEY_FILE : './security/cert.key'),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE ? process.env.SSL_CRT_FILE : './security/cert.pem'),
};

if (process.env.SSL_FULLCHAIN_FILE) {
   httpsOptions.ca = fs.readFileSync(process.env.SSL_FULLCHAIN_FILE);
}

const server = https.createServer(httpsOptions, app)
  .listen(port, () => {
      console.log('https server running at ' + port)
  });
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
