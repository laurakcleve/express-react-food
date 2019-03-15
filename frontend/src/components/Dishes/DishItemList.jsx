import React from 'react';

const DishItemList = ({ selectedDish }) => (
  <React.Fragment>
    <h4>Items</h4>
    {selectedDish && (
      <ul>
        {selectedDish.itemSets.map((itemSet) => (
          <li key={itemSet.id}>
            {itemSet.items.map((item) => (
              <span>{`${item.name}/`}</span>
            ))}{' '}
            {itemSet.optional && <span>(optional)</span>}
          </li>
        ))}
      </ul>
    )}
  </React.Fragment>
);

export default DishItemList;
