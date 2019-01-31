const queries = require('../data/queries');

exports.getInventory = (req, res) => {
  queries
    .getInventory()
    .then((inventory) => res.json(inventory))
    .catch((error) => res.status(500).json({ error }));
};
