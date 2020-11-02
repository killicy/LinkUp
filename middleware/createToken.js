const jwt = require('jsonwebtoken');
const key = require('../config/keys');

const createToken = (user) => {
    const token = jwt.sign(

        {
            id: user.id,
            Email: user.Email,
            Username: user.Username
        },

        key.secretOrKey,
        { expiresIn: 3600 },
        
    );
    return token;
}

module.exports = {createToken};