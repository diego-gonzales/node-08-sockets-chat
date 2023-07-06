const validateFieldsMiddleware = require('./validate-fields');
const validateJwtMiddleware = require('./validate-jwt');
const validateRolesMiddleware = require('./validate-roles');
const validateFileMiddleware = require('./validate-file');

module.exports = {
  ...validateFieldsMiddleware,
  ...validateJwtMiddleware,
  ...validateRolesMiddleware,
  ...validateFileMiddleware,
};
