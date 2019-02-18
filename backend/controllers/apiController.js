const queries = require('../data/queries');

exports.getItems = (req, res) => {
  queries
    .getItems()
    .then((items) => res.json(items))
    .catch((error) => res.status(500).json({ error }));
};

exports.getInventory = (req, res) => {
  queries
    .getInventory()
    .then((inventory) => res.json(inventory))
    .catch((error) => res.status(500).json({ error }));
};

exports.saveInventoryItem = (req, res) => {
  queries
    .saveInventoryItem(req.body)
    .then((inventory) => res.json(inventory))
    .catch((error) => res.status(500).json({ error }));
};

exports.editInventoryItem = (req, res) => {
  queries
    .editInventoryItem(req.body)
    .then((inventory) => res.json(inventory))
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteInventoryItem = (req, res) => {
  queries
    .deleteInventoryItem(req.body)
    .then((item) => res.json(item))
    .catch((error) => res.status(500).json({ error }));
};

exports.getItemLocations = (req, res) => {
  queries
    .getItemLocations()
    .then((itemLocations) => res.json(itemLocations))
    .catch((error) => res.status(500).json({ error }));
};

exports.getDishes = (req, res) => {
  queries
    .getDishes()
    .then((dishes) => res.json(dishes))
    .catch((error) => res.status(500).json({ error }));
};

exports.saveDish = (req, res) => {
  queries
    .saveDish(req.body)
    .then((dish) => res.json(dish))
    .catch((error) => res.status(500).json({ error }));
};

exports.editDish = (req, res) => {
  queries
    .editDish(req.body)
    .then((dishes) => res.json(dishes))
    .catch((error) => res.status(500).json({ error }));
};
