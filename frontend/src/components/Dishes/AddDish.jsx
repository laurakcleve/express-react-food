import React from 'react';

const AddDish = ({
  items,
  newDishName,
  newDishItemSets,
  handleDishNameChange,
  handleItemNameChange,
  handleRemoveSubstitute,
  addItemSetItem,
  handleItemOptionalChange,
  addItemSet,
  saveDish,
}) => (
  <form>
    <h3>Add dish</h3>
    <label htmlFor="name">
      Name
      <input type="text" name="newDishName" value={newDishName} onChange={handleDishNameChange} />
    </label>

    {newDishItemSets.map((newDishItemSet, itemSetIndex) => (
      <div key={newDishItemSet.id}>
        {newDishItemSet.items.map((itemSetItem, itemIndex) => (
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
              -
            </button>
          </div>
        ))}

        <button data-item-set-index={itemSetIndex} onClick={addItemSetItem}>
          Add substitute
        </button>

        <label htmlFor={`${itemSetIndex}Optional`}>
          Optional
          <input
            type="checkbox"
            id={`${itemSetIndex}Optional`}
            checked={newDishItemSet.optional}
            data-item-set-index={itemSetIndex}
            onChange={handleItemOptionalChange}
          />
        </label>
      </div>
    ))}

    <button type="button" onClick={addItemSet}>
      Add item
    </button>

    <button type="submit" onClick={saveDish}>
      Save
    </button>
  </form>
);

export default AddDish;
