const jwt = require('jsonwebtoken');
const { User } = require('../models');

const validateToken = async (token) => {
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(uid);

    if (!user) return null;
    if (!user.status) return null;

    return user;
  } catch (error) {
    return null;
  }
};

module.exports = { validateToken };
