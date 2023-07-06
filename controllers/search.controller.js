const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');
const { VALID_COLLECTIONS } = require('../consts');

const search = (req = request, res = response) => {
  const { collection, keyword } = req.params;

  if (Object.values(VALID_COLLECTIONS).indexOf(collection) < 0) {
    return res.status(400).json({
      msg: `The collections allowed are: ${Object.values(VALID_COLLECTIONS)}`,
    });
  }

  switch (collection) {
    case VALID_COLLECTIONS.USERS:
      searchUsers(keyword, res);
      break;

    case VALID_COLLECTIONS.PRODUCTS:
      searchProducts(keyword, res);
      break;

    case VALID_COLLECTIONS.CATEGORIES:
      searchCategories(keyword, res);
      break;

    default:
      res.status(500).json({
        msg: 'Sorry, we are working on it',
      });
      break;
  }
};

const searchUsers = async (keyword = '', res = response) => {
  const isMongoID = ObjectId.isValid(keyword);

  if (isMongoID) {
    const user = await User.findById(keyword);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(keyword, 'i'); // i: insensitive case

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  return res.json({
    results: users,
  });
};

const searchProducts = async (keyword = '', res = response) => {
  // Aquí considere que el keyword puede ser el id del producto o la categoría
  const isMongoID = ObjectId.isValid(keyword);

  if (isMongoID) {
    const product = await Product.find({
      $or: [{ _id: keyword }, { category: keyword }],
      $and: [{ status: true }],
    })
      .populate('category', 'name')
      .populate('user', 'name');

    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(keyword, 'i'); // i: insensitive case

  const products = await Product.find({ name: regex, status: true })
    .populate('category', 'name')
    .populate('user', 'name');

  return res.json({
    results: products,
  });
};

const searchCategories = async (keyword = '', res = response) => {
  const isMongoID = ObjectId.isValid(keyword);

  if (isMongoID) {
    const category = await Category.findById(keyword).populate('user', 'name');
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(keyword, 'i'); // i: insensitive case

  const categories = await Category.find({
    name: regex,
    status: true,
  }).populate('user', 'name');

  return res.json({
    results: categories,
  });
};

module.exports = {
  search,
};
