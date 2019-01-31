const db = require('../db');

const getNakedInventoryItem = (id) =>
  db('inventory_item')
    .select('inventory_item.*', 'item.name')
    .innerJoin('item', 'item.id', 'inventory_item.item_id')
    .where('inventory_item.id', id)
    .first();

const getInventoryItemDishes = (id) =>
  db('inventory_item')
    .select('dish.id', 'dish.name')
    .innerJoin('item', 'item.id', 'inventory_item.item_id')
    .leftJoin('dish_item', 'dish_item.item_id', 'item.id')
    .leftJoin('dish', 'dish.id', 'dish_item.dish_id')
    .where('inventory_item.id', id);

const getInventoryItem = (id) =>
  Promise.all([getNakedInventoryItem(id), getInventoryItemDishes(id)]).then(
    (inventoryItem) => ({
      ...inventoryItem[0],
      dishes: inventoryItem[1],
    })
  );

const getInventory = () =>
  db('inventory_item')
    .select('id')
    .then((ids) => Promise.all(ids.map((id) => getInventoryItem(id.id))));

module.exports = { getInventory };
