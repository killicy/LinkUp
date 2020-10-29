const express = require('express');
const router = express.Router();

const Login = require('../models/Login');

router.get('/message', (req, res) => {
	res.send({message: "Hello from Express Mongo backend."});
});

// Example
// router.get('/todos', function(req, res) {
//     Login.find(function(err, todos) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(todos);
//         }
//     });
// });

module.exports = router;
