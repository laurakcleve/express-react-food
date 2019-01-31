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
