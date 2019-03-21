import React from 'react';
import styled from 'styled-components';

import EditDish from './EditDish';

const DishList = ({
  dishes,
  items,
  dishTags,
  editDishID,
  editDishName,
  editDishTags,
  editDishItemSets,
  showDishItems,
  editDish,
  cancelEditDish,
  saveEditDish,
}) => (
  <StyledDishList>
    <ul>
      {dishes.map((dish) => (
        <li key={dish.id}>
          <button className="dish-name" data-id={dish.id} onClick={showDishItems}>
            {dish.name}
          </button>

          {dish.tags.map((tag) => (
            <span>{tag.name}</span>
          ))}

          <button className="edit" onClick={editDish} data-id={dish.id} data-name={dish.name}>
            Edit
          </button>

          {editDishID === dish.id && (
            <EditDish
              items={items}
              dishTags={dishTags}
              editDishName={editDishName}
              editDishTags={editDishTags}
              editDishItemSets={editDishItemSets}
              cancelEditDish={cancelEditDish}
              saveEditDish={saveEditDish}
            />
          )}
        </li>
      ))}
    </ul>
  </StyledDishList>
);

const StyledDishList = styled.div`
  ul {
    list-style-type: none;
    padding: 0;

    li {
      display: grid;
      grid-template-columns: 7fr 2fr 1fr;
      border: 1px solid #eaeaea;

      &:nth-child(even) {
        background-color: #f1f1f1;
      }
    }
  }

  .dish-name {
    padding: 10px;
    background-color: transparent;
    border: none;
    text-align: left;
  }

  button.edit {
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 20px;
    width: 60px;
    margin-top: 8px;
  }
`;

export default DishList;
