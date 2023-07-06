const { Router } = require('express');
const {
  uploadFile,
  updateCollectionImage,
  getCollectionImage,
  updateCollectionImageCloudinary,
} = require('../controllers/uploads.controller');
const { param } = require('express-validator');
const { validateFields, validateFile } = require('../middlewares');
const { VALID_COLLECTIONS_TO_UPLOAD_FILE } = require('../consts');

const router = Router();

router.post('/', validateFile, uploadFile);

router.put(
  '/:collection/:id',
  [
    param('id', 'The ID is not valid').isMongoId(),
    param('collection', 'The collection is not valid').isIn(
      VALID_COLLECTIONS_TO_UPLOAD_FILE
    ),
    validateFields,
    validateFile,
  ],
  // updateCollectionImage
  updateCollectionImageCloudinary
);

router.get(
  '/:collection/:id',
  [
    param('id', 'The ID is not valid').isMongoId(),
    param('collection', 'The collection is not valid').isIn(
      VALID_COLLECTIONS_TO_UPLOAD_FILE
    ),
    validateFields,
  ],
  getCollectionImage
);

module.exports = router;
