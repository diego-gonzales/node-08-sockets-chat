const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');

// Version with 'limit' and 'offset'
// const getUsers = async (req = request, res = response) => {
//   const {  limit = 10, offset = 0 } = req.query;
//   const users = await User.find()
//     .skip(Number(offset))
//     .limit(Number(limit))
//   res.json({
//     users
//   });
// };

// Version with 'page' and 'page_size'
const getUsers = async (req = request, res = response) => {
  const { page = 1, page_size = 10 } = req.query;

  const [users, total] = await Promise.all([
    User.find({ status: true }).skip((page - 1) * page_size).limit(page_size),
    User.countDocuments({ status: true })
  ]);

  const num_pages = Math.ceil(total / page_size);
  const next = page < num_pages ? `/api/users?page=${page + 1}&page_size=${page_size}` : null;
  const previous = page > 1 ? `/api/users?page=${page - 1}&page_size=${page_size}` : null;

  res.json({
    total,
    page,
    num_pages,
    page_size,
    next,
    previous,
    results: users
  });
};

const getUser = (req = request, res = response) => {
  const userID = req.params.id;

  res.json({
    msg: 'get user',
    data: {
      userID
    }
  });
};

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save on DB
  await user.save();

  res.status(201).json(user);
};

const updateUser = async (req = request, res = response) => {
  const userID = req.params.id;
  const { _id, password, google, email, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(userID, resto, { new: true }); 

  res.json(user);
};

const deleteUser = async (req = request, res = response) => {
  const userID = req.params.id;
  const userAuthenticated = req.userAuthenticated;

  // This code remove the user from the DB
  // const user = await User.findByIdAndDelete(userID);

  // This code set the user status to false
  await User.findByIdAndUpdate(userID, { status: false });

  res.json({
    msg: 'User has been deleted!'
  });
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}