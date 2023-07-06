const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {

    const payload = { uid };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN };
    const secret = process.env.JWT_SECRET;

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  })
};


module.exports = {
  generateJWT
}