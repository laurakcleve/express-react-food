const db = require('../db');

//
//   ITEM CHECK
//----------------------------------------------------------------------------------
const itemCheck = (items, itemName) => {
  const itemNames = items.map((item) => item.name);
  if (itemNames.includes(itemName)) {
    const existingItem = items.filter((item) => item.name === itemName)[0];
    return Promise.resolve(existingItem.id);
  }

  return db('item')
    .insert({ name: itemName })
    .returning('id')
    .then((newItemIDs) => Promise.resolve(newItemIDs[0]));
};

//
//   ITEM LOCATION CHECK
//----------------------------------------------------------------------------------
const itemLocationCheck = (itemLocations, itemLocationName) => {
  if (!itemLocationName) {
    return Promise.resolve(-1);
  }

  const itemLocationNames = itemLocations.map(
    (itemLocation) => itemLocation.name
  );

  if (itemLocationNames.includes(itemLocationName)) {
    const existingItemLocation = itemLocations.filter(
      (itemLocation) => itemLocation.name === itemLocationName
    )[0];
    return Promise.resolve(existingItemLocation.id);
  }

  return db('inventory_item_location')
    .insert({ name: itemLocationName })
    .returning('id')
    .then((newItemLocationIDs) => Promise.resolve(newItemLocationIDs[0]));
};

//
//   GET ITEMS
//----------------------------------------------------------------------------------
const getItems = () => db('item').select();

//
// GET NAKED INVENTORY ITEM
//----------------------------------------------------------------------------------
const getNakedInventoryItem = (id) =>
  db('inventory_item')
    .select('inventory_item.*', 'item.name', 'iil.name as location')
    .innerJoin('item', 'item.id', 'inventory_item.item_id')
    .leftJoin(
      { iihl: 'inventory_item_has_location' },
      'iihl.inventory_item_id',
      'inventory_item.id'
    )
    .leftJoin(
      { iil: 'inventory_item_location' },
      'iil.id',
      'iihl.inventory_item_location_id'
    )
    .where('inventory_item.id', id)
    .first();

//
//   GET INVENTORY ITEM DISHES
//----------------------------------------------------------------------------------
const getInventoryItemDishes = (id) =>
  db('inventory_item')
    .select('dish.id', 'dish.name')
    .innerJoin('item', 'item.id', 'inventory_item.item_id')
    .innerJoin('dish_item', 'dish_item.item_id', 'item.id')
    .innerJoin('dish', 'dish.id', 'dish_item.dish_id')
    .where('inventory_item.id', id);

//
//   GET INVENTORY ITEM
//----------------------------------------------------------------------------------
const getInventoryItem = (id) =>
  Promise.all([getNakedInventoryItem(id), getInventoryItemDishes(id)]).then(
    (inventoryItem) => ({
      ...inventoryItem[0],
      dishes: inventoryItem[1],
    })
  );

//
//   GET INVENTORY
//----------------------------------------------------------------------------------
const getInventory = () =>
  db('inventory_item')
    .select('id')
    .then((ids) => Promise.all(ids.map((id) => getInventoryItem(id.id))));

//
//   SAVE INVENTORY ITEM
//----------------------------------------------------------------------------------
const saveInventoryItem = (data) =>
  Promise.all([
    itemCheck(data.items, data.newItemName),
    itemLocationCheck(data.itemLocations, data.newItemLocation),
  ]).then((results) =>
    db('inventory_item')
      .insert({
        item_id: results[0],
        add_date: data.newItemAddDate || null,
        amount: data.newItemAmount,
        expiration: data.newItemExpiration || null,
      })
      .returning('id')
      .then((newInventoryItemIDs) => {
        if (results[1] === -1) {
          return Promise.resolve();
        }

        return db('inventory_item_has_location').insert({
          inventory_item_id: newInventoryItemIDs[0],
          inventory_item_location_id: results[1],
        });
      })
  );

//
//   EDIT INVENTORY ITEM
//----------------------------------------------------------------------------------
const editInventoryItem = (data) =>
  Promise.all([
    itemCheck(data.items, data.editItemName),
    itemLocationCheck(data.itemLocations, data.editItemLocation),
  ]).then((results) =>
    Promise.all([
      db('inventory_item')
        .update({
          item_id: results[0],
          add_date: data.editItemAddDate || null,
          amount: data.editItemAmount,
          expiration: data.editItemExpiration,
        })
        .where('id', data.editItemID),
      db('inventory_item_has_location')
        .select()
        .where('inventory_item_id', data.editItemID)
        .then((rows) => {
          if (results[1] === -1) return Promise.resolve();
          if (rows.length) {
            return db('inventory_item_has_location')
              .update({
                inventory_item_location_id: results[1],
              })
              .where('inventory_item_id', data.editItemID);
          }
          return db('inventory_item_has_location').insert({
            inventory_item_id: data.editItemID,
            inventory_item_location_id: results[1],
          });
        }),
    ])
  );

//
//   DELETE INVENTORY ITEM
//----------------------------------------------------------------------------------
const deleteInventoryItem = (data) =>
  db('inventory_item')
    .del()
    .where('id', data.itemID);

//
//   GET ITEM LOCATIONS
//----------------------------------------------------------------------------------
const getItemLocations = () => db('inventory_item_location').select();

//
//   GET NAKED DISH
//----------------------------------------------------------------------------------
const getNakedDish = (id) =>
  db('dish')
    .select()
    .where('id', id)
    .first();

//
//   GET DISH ITEMS
//----------------------------------------------------------------------------------
const getDishItems = (id) =>
  db('dish')
    .select('item.id', 'item.name')
    .innerJoin('dish_item', 'dish_item.dish_id', 'dish.id')
    .innerJoin('item', 'item.id', 'dish_item.item_id')
    .where('dish.id', id);

//
//   GET DISH
//----------------------------------------------------------------------------------
const getDish = (id) =>
  Promise.all([getNakedDish(id), getDishItems(id)]).then(
    (dish) =>
      console.log(dish) || {
        ...dish[0],
        items: dish[1],
      }
  );

//   GET DISHES
//----------------------------------------------------------------------------------
const getDishes = () =>
  db('dish')
    .select('id')
    .then((ids) => Promise.all(ids.map((id) => getDish(id.id))));

//   SAVE DISH
//----------------------------------------------------------------------------------
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
  editInventoryItem,
  deleteInventoryItem,
  getItemLocations,
  getDishes,
  saveDish,
};
