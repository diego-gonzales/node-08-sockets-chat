const { User, Category, Product } = require('./models');

const VALID_COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  ROLES: 'roles',
};

const COLLECTIONS = {
  users: User,
  categories: Category,
  products: Product,
};

const VALID_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

const VALID_COLLECTIONS_TO_UPLOAD_FILE = [
  VALID_COLLECTIONS.USERS,
  VALID_COLLECTIONS.PRODUCTS,
];

module.exports = {
  VALID_COLLECTIONS,
  COLLECTIONS,
  VALID_EXTENSIONS,
  VALID_COLLECTIONS_TO_UPLOAD_FILE,
};
