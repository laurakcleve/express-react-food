const express = require('express');
const controller = require('../controllers/apiController');

const router = express.Router();

router.get('/inventory', controller.getInventory);

module.exports = router;
