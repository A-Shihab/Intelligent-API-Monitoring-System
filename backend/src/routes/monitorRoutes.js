const express = require('express');
const router = express.Router();
const { monitorApi } = require('../controllers/monitorController');

router.post('/monitor', monitorApi);

module.exports = router;