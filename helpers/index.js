const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');
const validateToken = require('./validate-token');

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile,
  ...validateToken,
};
