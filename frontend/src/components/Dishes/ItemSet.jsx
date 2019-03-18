import React from 'react';
import styled from 'styled-components';

const ItemSet = ({
  items,
  newDishItemSet,
  itemSetIndex,
  handleItemNameChange,
  handleRemoveSubstitute,
  handleItemOptionalChange,
  addItemSetItem,
}) => (
  <StyledItemSet>
    <label htmlFor={`${itemSetIndex}Optional`} className="optional">
      Optional
      <input
        type="checkbox"
        id={`${itemSetIndex}Optional`}
        checked={newDishItemSet.optional}
        data-item-set-index={itemSetIndex}
        onChange={handleItemOptionalChange}
      />
    </label>
    {newDishItemSet.items.map((itemSetItem, itemIndex) => (
      <React.Fragment>
        <div className="substitute" key={itemSetItem.id}>
          <input
            type="text"
            value={itemSetItem.name}
            data-item-set-index={itemSetIndex}
            data-item-set-item-index={itemIndex}
            onChange={handleItemNameChange}
            list={`${itemSetItem.id}List`}
          />
          <datalist id={`${itemSetItem.id}List`}>
            {items.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </datalist>

          <button
            className="remove-substitute"
            data-item-set-index={itemSetIndex}
            data-item-set-item-index={itemIndex}
            onClick={handleRemoveSubstitute}
          >
            &mdash;
          </button>
        </div>
      </React.Fragment>
    ))}

    <button className="add-substitute" data-item-set-index={itemSetIndex} onClick={addItemSetItem}>
      Add substitute
    </button>
  </StyledItemSet>
);

const StyledItemSet = styled.div`
  position: relative;
  width: 420px;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fff;
  border: none;
  box-shadow: 0px 2px 10px #dcdcdc;

  input[type='text'] {
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #505050;
    font-size: 13px;
  }

  button {
    &.add-substitute {
      width: 110px;
      margin-top: 10px;
      background-color: #d9cee8;
      color: #7e688e;
      border: none;
      text-transform: uppercase;
      font-weight: bold;
    }

    &.remove-substitute {
      width: 30px;
      height: 25px;
      margin-left: 10px;
      background-color: transparent;
      border: 1px solid #cbbce0;
    }
  }

  .optional {
    position: absolute;
    right: 5px;
    top: 5px;
    text-transform: uppercase;
    font-size: 11px;
    color: #868686;
  }
`;

export default ItemSet;