const { request, response } = require('express');
const { COLLECTIONS } = require('../consts');
const { ObjectId } = require('mongoose').Types;

const searchv2 = async (req = request, res = response) => {
  const { collection, keyword } = req.params;

  if (!COLLECTIONS[collection]) {
    return res.status(400).json({
      ok: false,
      msg: `The collections allowed are: ${Object.keys(COLLECTIONS)}`,
    });
  }

  // el 'return' puede o no ir, ya que no se ejecuta nada despues de la funcion
  return searchItem(collection, keyword, res);
};

const searchItem = async (collection, keyword, res = response) => {
  const isMongoID = ObjectId.isValid(keyword);

  if (isMongoID) {
    const item = await COLLECTIONS[collection].findById(keyword);

    return res.json({
      results: item ? [item] : [],
    });
  }

  const regex = new RegExp(keyword, 'i');

  const items = await COLLECTIONS[collection].find(
    getItemFilter(collection, regex)
  );

  return res.json({
    results: items,
  });
};

const getItemFilter = (collection, regex) => {
  const filters = {
    users: {
      $or: [{ name: regex }, { email: regex }],
      $and: [{ status: true }],
    },
    categories: { name: regex, status: true },
    products: { name: regex, status: true },
  };

  return filters[collection];
};

module.exports = {
  searchv2,
};
