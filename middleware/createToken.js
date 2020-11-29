const jwt = require('jsonwebtoken');
const key = require('../config/keys');

const verifyToken = (token) => {
    return jwt.verify(token, key.secretOrKey);
}

const createToken = (user) => {
  const token = jwt.sign(

      {
          id: user.id,
          Email: user.Email,
          Username: user.Username,
          Profile_pic: user.Profile_pic
      },

      key.secretOrKey,
      { expiresIn: "1h" },

  );
  return token;
}

module.exports = {verifyToken, createToken};
