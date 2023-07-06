const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const validateJwt = async (req = request, res = response, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    try {
      const { uid } = jwt.verify(token, process.env.JWT_SECRET);

      // Get user authenticated by token decoded
      const userAuthenticated = await User.findById(uid);

      if (!userAuthenticated) {
        // throw Error();
        return res.status(401).json({ msg: 'Invalid Token - User not found' });
      }

      // Verify if user is active
      if (!userAuthenticated.status) {
        // throw Error();
        return res.status(401).json({ msg: 'Invalid token - User is not active' });
      }

      req.userAuthenticated = userAuthenticated;
      next();

    } catch (err) {
      console.log(err);
      res.status(401).json({ msg: 'Invalid token' });
    }

  } else {
    res.status(401).json({ msg: 'No token provided'});
  }

  // Example with Bearer token
  // if (token && token.startsWith('Bearer ')) {
  //   // Remove Bearer from string
  //   jwt.verify(token.slice(7, token.length), process.env.JWT_SECRET, (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ msg: 'Token is not valid' });
  //     }
  //     req.uid = decoded.uid;
  //     next();
  //   });
  // }
  // else {
  //   return res.status(401).json({ msg: 'Bearer token not provided' });
  // }
};


module.exports = {
  validateJwt
}