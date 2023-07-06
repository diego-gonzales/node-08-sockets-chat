const { request, response } = require('express');
const { Product, Category } = require('../models');

const getProducts = async (req = request, res = response) => {
  const { page = 1, page_size = 10 } = req.query;

  try {
    const [products, total] = await Promise.all([
      Product.find({ status: true })
        .skip((page - 1) * page_size)
        .limit(page_size)
        .populate('user', 'name')
        .populate('category', 'name'),
      Product.countDocuments({ status: true }),
    ]);

    const num_pages = Math.ceil(total / page_size);
    const next =
      page < num_pages
        ? `/api/products?page=${page + 1}&page_size=${page_size}`
        : null;
    const previous =
      page > 1 ? `/api/products?page=${page - 1}$page_size=${page_size}` : null;

    res.json({
      total,
      page,
      num_pages,
      page_size,
      next,
      previous,
      results: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate('user', 'name')
      .populate('category', 'name');

    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const createProduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  try {
    const data = {
      ...req.body,
      name,
      user: req.userAuthenticated._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  const productID = req.params.id;
  const { _id, status, user, ...restData } = req.body;

  if (restData.name) restData.name = restData.name.toUpperCase();

  try {
    const data = {
      ...restData,
      user: req.userAuthenticated._id,
    };

    const product = await Product.findByIdAndUpdate(productID, data, {
      new: true,
    })
      .populate('user', 'name')
      .populate('category', 'name');

    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  const productID = req.params.id;

  try {
    await Product.findByIdAndUpdate(productID, { status: false });
    res.json({ msg: 'Product deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};