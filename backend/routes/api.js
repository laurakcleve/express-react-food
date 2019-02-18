const express = require('express');
const controller = require('../controllers/apiController');

const router = express.Router();

router.get('/items', controller.getItems);

router.get('/inventory', controller.getInventory);
router.post('/inventory/saveitem', controller.saveInventoryItem);
router.post('/inventory/edititem', controller.editInventoryItem);
router.post('/inventory/deleteitem', controller.deleteInventoryItem);

router.get('/itemlocations', controller.getItemLocations);

router.get('/dishes', controller.getDishes);
router.post('/dishes/savedish', controller.saveDish);
router.post('/dishes/editdish', controller.editDish);

module.exports = router;
