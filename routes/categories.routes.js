const { Router } = require('express');
const { check, query, param } = require('express-validator');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');
const { categoryExistsByID, categoryIsNotRegistered } = require('../helpers');

const { validateJwt, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

router.get(
  '/',
  [
    query('page', 'Page invalid').optional().isInt({ min: 1 }).toInt(),
    query('page_size', 'Page size invalid')
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    validateFields,
  ],
  getCategories
);

router.get(
  '/:id',
  [
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(categoryExistsByID),
    validateFields,
  ],
  getCategory
);

router.post(
  '/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(categoryIsNotRegistered),
    validateFields,
  ],
  createCategory
);

router.put(
  '/:id',
  [
    validateJwt,
    param('id', 'ID invalid').isMongoId(), // puedo usar 'check' o 'param', igual válida el parámetro
    param('id').custom(categoryExistsByID),
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
  ],
  updateCategory
);

router.delete(
  '/:id',
  [
    validateJwt,
    isAdminRole,
    param('id', 'ID invalid').isMongoId(), // puedo usar 'check' o 'param', igual válida el parámetro
    validateFields, // para ahí y ya no muestre el error de abajo
    param('id').custom(categoryExistsByID),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
