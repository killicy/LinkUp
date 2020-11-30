const jwt = require('jsonwebtoken');
const key = require('../config/keys');

//get token
function auth(req, res, next) {
    
    //const token = req.headers["authorization"];
    const token = req.cookies.access_token ? req.cookies.access_token : req.headers.access_token;
    // Check for token
    if(!token){
        res.status(401).json({ msg: 'No token, authorization denied'});
        return;
    }

    try{
        // Verify token
        const decoded = jwt.verify(token, key.secretOrKey);

        //Add user from payload
        req.user = decoded;
        next();

    } catch(e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
