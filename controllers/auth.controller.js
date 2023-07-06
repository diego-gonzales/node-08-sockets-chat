const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verify if email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: 'Email or password are invalid - email' });
    }

    // Verify if user is active
    if (!user.status) {
      return res
        .status(400)
        .json({ msg: 'Email or password are invalid - status false' });
    }

    // Verify if password is correct
    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ msg: 'Email or password are invalid - password' });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      access_token: token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { google_token } = req.body;

  try {
    const { name, email, picture } = await googleVerify(google_token);

    let user = await User.findOne({ email });

    // If user does not exist, create a new one
    if (!user) {
      user = new User({
        name,
        email,
        password: ':PPPPP', // Here we use a password that is not used
        imageURL: picture,
        google: true,
      });

      await user.save();
    }

    // If user is not active, send error. Here also I would can activate the user instead of sending an error
    if (!user.status) {
      return res
        .status(401)
        .json({ msg: 'Blocked user. Please, talk to the administrator' });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      access_token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Google token is invalid',
    });
  }
};

const renewToken = async (req = request, res = response) => {
  const { userAuthenticated } = req;

  const renewToken = await generateJWT(userAuthenticated.id);

  return res.json({
    ok: true,
    user: userAuthenticated,
    access_token: renewToken,
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
