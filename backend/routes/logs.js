const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');

router.get('/', getLogs); // [cite: 170]

module.exports = router;