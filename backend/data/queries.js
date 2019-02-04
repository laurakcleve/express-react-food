const db = require('../db');

const getItems = () => db('item').select();

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
    .innerJoin('dish_item', 'dish_item.item_id', 'item.id')
    .innerJoin('dish', 'dish.id', 'dish_item.dish_id')
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

const saveInventoryItem = (data) => {
  const itemNames = data.items.map((item) => item.name);
  if (itemNames.includes(data.newItemName)) {
    const existingItem = data.items.filter(
      (item) => item.name === data.newItemName
    )[0];

    return db('inventory_item')
      .insert({
        item_id: existingItem.id,
        add_date: data.newItemAddDate || null,
        amount: data.newItemAmount,
        shelflife: data.newItemShelflife || null,
      })
      .returning('id');
  }

  return db('item')
    .insert({ name: data.newItemName })
    .returning('id')
    .then((itemIDs) =>
      db('inventory_item')
        .insert({
          item_id: itemIDs[0],
          add_date: data.newItemAddDate || null,
          amount: data.newItemAmount,
          shelflife: data.newItemShelflife || null,
        })
        .returning('id')
    );
};

const deleteInventoryItem = (data) =>
  db('inventory_item')
    .del()
    .where('id', data.itemID);

const getNakedDish = (id) =>
  db('dish')
    .select()
    .where('id', id)
    .first();

const getDishItems = (id) =>
  db('dish')
    .select('item.id', 'item.name')
    .innerJoin('dish_item', 'dish_item.dish_id', 'dish.id')
    .innerJoin('item', 'item.id', 'dish_item.item_id')
    .where('dish.id', id);

const getDish = (id) =>
  Promise.all([getNakedDish(id), getDishItems(id)]).then(
    (dish) =>
      console.log(dish) || {
        ...dish[0],
        items: dish[1],
      }
  );

const getDishes = () =>
  db('dish')
    .select('id')
    .then((ids) => Promise.all(ids.map((id) => getDish(id.id))));

const saveDish = (data) =>
  db('dish')
    .insert({ name: data.newDishName })
    .returning('id')
    .then((dishIDs) => {
      const itemNames = data.items.map((item) => item.name);

      return Promise.all(
        data.newDishItems.map((newItem) => {
          if (itemNames.includes(newItem.name)) {
            const existingItem = data.items.filter(
              (item) => item.name === newItem.name
            )[0];

            return db('dish_item')
              .insert({
                dish_id: dishIDs[0],
                item_id: existingItem.id,
              })
              .returning('id');
          }

          return db('item')
            .insert({ name: newItem.name })
            .returning('id')
            .then((itemIDs) =>
              db('dish_item')
                .insert({ dish_id: dishIDs[0], item_id: itemIDs[0] })
                .returning('id')
            );
        })
      );
    });

module.exports = {
  getItems,
  getInventory,
  saveInventoryItem,
  deleteInventoryItem,
  getDishes,
  saveDish,
};
