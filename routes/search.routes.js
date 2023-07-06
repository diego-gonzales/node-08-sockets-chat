const { Router } = require('express');
const { search } = require('../controllers/search.controller');
const { searchv2 } = require('../controllers/searchv2.controller');

const router = Router();

router.get('/:collection/:keyword', search);

router.get('/v2/:collection/:keyword', searchv2);

module.exports = router;