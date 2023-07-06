const { request, response } = require("express");
const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {
  const { page = 1, page_size = 10 } = req.query;

  try {
    const [categories, total] = await Promise.all([
      Category.find({ status: true })
        .skip((page - 1) * page_size)
        .limit(page_size)
        .populate('user', 'name'),
      Category.countDocuments({ status: true })
    ]);

    const num_pages = Math.ceil(total / page_size);
    const next = page < num_pages ? `/api/categories?page=${page + 1}&page_size=${page_size}` : null;
    const previous = page > 1 ? `/api/categories?page=${page - 1}$page_size=${page_size}` : null;

    res.json({
      total,
      page,
      num_pages,
      page_size,
      next,
      previous,
      results: categories
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate('user', 'name');
    res.json(category)

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  try {
    // Generate data to save
    const data = {
      name,
      // este es el usuario que se anexa cuando se verifica el token (ver middleware validate-jwt)
      user: req.userAuthenticated._id,
    };

    const newCategory = new Category(data);
    await newCategory.save();

    res.status(201).json(newCategory);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

const updateCategory = async (req = request, res = response) => {
  const categoryID = req.params.id;
  const { _id, name, status, user } = req.body;

  try {
    const data = {
      name: name.toUpperCase(),
      user: req.userAuthenticated._id
    };

    const category = await Category.findByIdAndUpdate(categoryID, data, { new: true }).populate('user', 'name');
    res.json(category);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

const deleteCategory = async (req = request, res = response) => {
  const categoryID = req.params.id;

  try {
    await Category.findByIdAndUpdate(categoryID, { status: false });
    res.json({
      msg: 'Category has been deleted!'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
