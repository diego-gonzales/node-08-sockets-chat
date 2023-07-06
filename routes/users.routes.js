const { Router } = require('express');
const { check, query } = require('express-validator');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../controllers/users.controller');
const { isValidRole, emailExists, userExistsByID } = require('../helpers');
const {
  validateFields,
  validateJwt,
  isAdminRole,
  haveRole,
} = require('../middlewares');

const router = Router();

// Version with 'limit' and 'offset'
// router.get('/', [
//   query('page_size', 'Page size is invalid').optional().isInt({ min: 1 }).toInt(),
//   query('offset', 'Offset is invalid').optional().isInt({ min: 0 }).toInt(),
//   validateFields
// ], getUsers);

// Version with 'page' and 'page_size'
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
  getUsers
);

router.get('/:id', getUser);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email invalid').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    // This is not necessary because we are using the Role model to validate the role
    // check('role', 'Role must be user or admin').isIn(['user', 'admin']),
    check('role').custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(userExistsByID),
    check('role').custom(isValidRole),
    validateFields,
  ],
  updateUser
);

router.delete(
  '/:id',
  [
    validateJwt,
    // isAdminRole,
    haveRole('VENTAS', 'ADMIN'),
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(userExistsByID),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
