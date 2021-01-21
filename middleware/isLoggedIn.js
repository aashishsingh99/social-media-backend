const jwt = require('jsonwebtoken');

const secret = process.env.secret;

const User = require('../models/user.model');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in' });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in' });
    }

    const { _id } = payload;
    User.findById(_id)
      .then((foundUser) => {
        req.user = foundUser;
        next();
      });
  });
};
