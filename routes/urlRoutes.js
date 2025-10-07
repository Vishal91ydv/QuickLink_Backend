const express = require('express');
const router = express.Router();
const { createShortUrl } = require('../controllers/urlController');

// POST /api/url/shorten
router.post('/shorten', createShortUrl);

module.exports = router;
