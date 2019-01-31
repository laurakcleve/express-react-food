const express = require('express');
const controller = require('../controllers/apiController');

const router = express.Router();

router.get('/items', controller.getItems);
router.get('/inventory', controller.getInventory);
router.post('/inventory/saveitem', controller.saveInventoryItem);
router.post('/inventory/deleteitem', controller.deleteInventoryItem);

module.exports = router;
