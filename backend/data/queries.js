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
    .select()
    .distinct('dish.id')
    .innerJoin('item', 'item.id', 'inventory_item.item_id')
    .innerJoin('item_set_item', 'item_set_item.item_id', 'item.id')
    .innerJoin('item_set', 'item_set.id', 'item_set_item.item_set_id')
    .innerJoin('dish', 'dish.id', 'item_set.dish_id')
    .where('inventory_item.id', id);

//
//   GET INVENTORY ITEM
//----------------------------------------------------------------------------------
const getInventoryItem = (id) =>
  Promise.all([getNakedInventoryItem(id), getInventoryItemDishes(id)]).then(
    (results) =>
      Promise.all(results[1].map((dish) => getDish(dish.id))).then((dishes) =>
        Promise.resolve({ ...results[0], dishes })
      )
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
//   GET DISH ITEM SETS
//----------------------------------------------------------------------------------
const getDishItemSets = (id) =>
  db('dish')
    .select('item_set.id', 'item_set.optional')
    .innerJoin('item_set', 'item_set.dish_id', 'dish.id')
    .where('dish.id', id);

//
//   GET DISH ITEM SET ITEMS
//----------------------------------------------------------------------------------
const getDishItemSetItems = (id) =>
  db('item_set')
    .select(
      'item.id',
      'item.name',
      'item_set_item.amount_num',
      'item_set_item.amount_unit'
    )
    .innerJoin('item_set_item', 'item_set_item.item_set_id', 'item_set.id')
    .innerJoin('item', 'item.id', 'item_set_item.item_id')
    .where('item_set.id', id);

//
//   GET DISH ITEMS
//----------------------------------------------------------------------------------
const getDishItems = (id) =>
  getDishItemSets(id).then((itemSets) =>
    Promise.all(
      itemSets.map((itemSet) => getDishItemSetItems(itemSet.id))
    ).then((itemSetsWithItems) => {
      const finalItemSets = itemSets.map((itemSet, index) => ({
        id: itemSet.id,
        optional: itemSet.optional,
        items: itemSetsWithItems[index],
      }));
      return Promise.resolve(finalItemSets);
    })
  );

//
//   GET DISH
//----------------------------------------------------------------------------------
const getDish = (id) =>
  Promise.all([getNakedDish(id), getDishItems(id)]).then((dish) => ({
    ...dish[0],
    itemSets: dish[1],
  }));

//
//   GET DISHES
//----------------------------------------------------------------------------------
const getDishes = () =>
  db('dish')
    .select('id')
    .then((ids) => Promise.all(ids.map((id) => getDish(id.id))));

//
//   SAVE DISH
//----------------------------------------------------------------------------------
const saveDish = (data) =>
  db('dish')
    .insert({ name: data.newDishName })
    .returning('id')
    .then((dishIDs) =>
      Promise.all(
        data.newDishItemSets.map((newItemSet) =>
          db('item_set')
            .insert({
              dish_id: dishIDs[0],
              optional: newItemSet.optional || null,
            })
            .returning('id')
            .then((newItemSetIDs) =>
              Promise.all(
                newItemSet.items.map((itemSetItem) =>
                  itemCheck(data.items, itemSetItem.name).then((itemID) =>
                    db('item_set_item').insert({
                      item_id: itemID,
                      item_set_id: newItemSetIDs[0],
                    })
                  )
                )
              )
            )
        )
      )
    );

//
//   EDIT DISH
//----------------------------------------------------------------------------------
const editDish = (data) =>
  db('item_set')
    .select('id')
    .where('dish_id', data.editDishID)
    .then((itemSets) =>
      Promise.all(
        itemSets
          .map((itemSet) =>
            db('item_set_item')
              .del()
              .where('item_set_id', itemSet.id)
          )
          .concat(
            db('item_set')
              .del()
              .where('dish_id', data.editDishID)
          )
      ).then(() =>
        Promise.all(
          data.editDishItemSets.map((itemSet) =>
            db('item_set')
              .insert({
                dish_id: data.editDishID,
                optional: itemSet.optional || null,
              })
              .returning('id')
              .then((newItemSetIDs) =>
                Promise.all(
                  itemSet.items.map((itemSetItem) =>
                    itemCheck(data.items, itemSetItem.name).then((itemID) =>
                      db('item_set_item').insert({
                        item_id: itemID,
                        item_set_id: newItemSetIDs[0],
                      })
                    )
                  )
                )
              )
          )
        )
      )
    );

module.exports = {
  getItems,
  getInventory,
  saveInventoryItem,
  editInventoryItem,
  deleteInventoryItem,
  getItemLocations,
  getDishes,
  saveDish,
  editDish,
};
