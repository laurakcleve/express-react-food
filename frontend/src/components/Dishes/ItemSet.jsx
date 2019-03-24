import React from 'react';
import styled from 'styled-components';

const ItemSet = ({
  items,
  itemSet,
  itemSetIndex,
  handleItemNameChange,
  handleRemoveItemSubstitute,
  handleItemOptionalChange,
  addItemSetItem,
}) => (
  <StyledItemSet>
    <label htmlFor={`${itemSetIndex}Optional`} className="optional">
      Optional
      <input
        type="checkbox"
        id={`${itemSetIndex}Optional`}
        checked={itemSet.optional}
        data-item-set-index={itemSetIndex}
        onChange={handleItemOptionalChange}
      />
    </label>
    {itemSet.items.map((itemSetItem, itemIndex) => (
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
          onClick={handleRemoveItemSubstitute}
        >
          &mdash;
        </button>
      </div>
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
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #d9cee8;
      color: #7e688e;
      border: none;
      border-radius: 4px;
      font-size: 11px;
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
