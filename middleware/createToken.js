const jwt = require('jsonwebtoken');
const key = require('../config/keys');

const createToken = (user) => {
    const token = jwt.sign(

        {
            id: user.id,
            Email: user.Email,
            fName: user.fName,
            lName: user.lName
        },

        key.secretOrKey,
        { expiresIn: "1h" },
        
    );
    return token;
}

module.exports = {createToken};