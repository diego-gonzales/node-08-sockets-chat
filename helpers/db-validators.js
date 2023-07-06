const { Role, User, Category, Product } = require('../models');

const isValidRole = async (value = '') => {
  const roleExists = await Role.findOne({ role: value });
  if (!roleExists) {
    throw new Error(`Role '${value}' does not exists.`);
  }
};

const emailExists = async (value = '') => {
  const emailExists = await User.findOne({ email: value });
  if (emailExists) {
    throw new Error(`Email '${value}' has already been registered.`);
  }
};

const userExistsByID = async (value = '') => {
  const userExists = await User.findById(value);
  if (!userExists) {
    throw new Error(`User '${value}' does not exists`);
  }
};

const categoryIsNotRegistered = async (value = '') => {
  // Aquí uso el 'toUpperCase()' ya que al guardar una categoría la guardo en mayúsculas
  const categoryExists = await Category.findOne({ name: value.toUpperCase() });
  if (categoryExists) {
    throw new Error(`Category '${value}' has already been registered.`);
  }
};

const categoryExistsByID = async (value = '') => {
  const categoryExists = await Category.findById(value);
  if (!categoryExists) {
    throw new Error(`Category '${value}' does not exists.`);
  }
};

const productIsNotRegistered = async (value = '') => {
  const productExists = await Product.findOne({ name: value.toUpperCase() });
  if (productExists) {
    throw new Error(`Product '${value}' has already been registered.`);
  }
};

const productExistsByID = async (value = '') => {
  const productExists = await Product.findById(value);
  if (!productExists) {
    throw new Error(`Product '${value}' does not exists.`);
  }
};

// Ya no se usa porque se usa el 'isIn()' de 'express-validator'
const validCollections = (collection = '', collections = []) => {
  const collectionIsIncluded = collections.includes(collection);
  if (!collectionIsIncluded) {
    throw new Error(`Collection '${collection}' is not valid.`);
  }
  return true;
};

module.exports = {
  isValidRole,
  emailExists,
  userExistsByID,
  categoryIsNotRegistered,
  categoryExistsByID,
  productIsNotRegistered,
  productExistsByID,
  validCollections,
};
