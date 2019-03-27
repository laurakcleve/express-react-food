import React from 'react';

import DishForm from './DishForm';

const EditDish = ({
  items,
  dishTags,
  editDishID,
  editDishName,
  editDishTags,
  editDishItemSets,
  cancelEditDish,
  saveEditDish,
  fetchData,
}) => (
  <DishForm
    items={items}
    dishTags={dishTags}
    cancel={cancelEditDish}
    editDishID={editDishID}
    existingName={editDishName}
    existingItemSets={editDishItemSets}
    existingTags={editDishTags}
    fetchData={fetchData}
    apiPath="/api/dishes/editdish"
  />
);

export default EditDish;
