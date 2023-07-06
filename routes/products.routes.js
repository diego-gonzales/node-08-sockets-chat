const { Router } = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');
const { validateFields, validateJwt, isAdminRole } = require('../middlewares');
const { check, query, param } = require('express-validator');
const {
  productExistsByID,
  productIsNotRegistered,
  categoryExistsByID,
} = require('../helpers');

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
  getProducts
);

router.get(
  '/:id',
  [
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(productExistsByID),
    validateFields,
  ],
  getProduct
);

router.post(
  '/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(productIsNotRegistered),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'Category invalid').isMongoId(),
    check('category').custom(categoryExistsByID),
    validateFields,
  ],
  createProduct
);

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(productExistsByID),
    // El optional() lo que hace es validar solo si el campo viene en la petición
    check('category', 'Category is required').optional().not().isEmpty(),
    check('category', 'Category invalid').optional().isMongoId(),
    check('category').optional().custom(categoryExistsByID),
    validateFields,
  ],
  updateProduct
);

router.delete(
  '/:id',
  [
    validateJwt,
    isAdminRole,
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(productExistsByID),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
