import React from 'react';

import DishForm from './DishForm';

const EditDish = ({ items, dishTags, editDishName, editDishTags, editDishItemSets, cancelEditDish, saveEditDish }) => (
  <DishForm
    items={items}
    dishTags={dishTags}
    cancel={cancelEditDish}
    save={saveEditDish}
    existingName={editDishName}
    existingItemSets={editDishItemSets}
    existingTags={editDishTags}
  />
);

export default EditDish;
