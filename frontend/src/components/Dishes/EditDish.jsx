import React from 'react';

const EditDish = ({
  items,
  dishTags,
  editDishName,
  editDishTags,
  editDishItemSets,
  handleChange,
  handleEditDishAddTag,
  handleEditDishTagInput,
  handleEditDishRemoveTag,
  handleEditItemAdd,
  handleEditItemNameChange,
  handleEditItemRemove,
  handleEditItemOptionalChange,
  addEditItemSetItem,
  cancelEditDish,
  saveEditDish,
}) => (
  <form className="edit-dish-form">
    <label htmlFor="editDishName">
      Name
      <input type="text" name="editDishName" value={editDishName} onChange={handleChange} />
    </label>

    <label htmlFor="">
      Tags
      {editDishTags &&
        editDishTags.map((tag, index) => (
          <React.Fragment>
            <input
              type="text"
              value={tag}
              data-index={index}
              onChange={handleEditDishTagInput}
              list={`tag${index}List`}
            />
            <datalist id={`tag${index}List`}>
              {dishTags.map((dishTag) => (
                <option>{dishTag.name}</option>
              ))}
            </datalist>
            <button data-index={index} onClick={handleEditDishRemoveTag}>
              X
            </button>
          </React.Fragment>
        ))}
    </label>
    <button type="button" onClick={handleEditDishAddTag}>
      +
    </button>

    <br />
    <div>
      Items
      <br />
      {editDishItemSets.map((itemSet, itemSetIndex) => (
        <React.Fragment>
          {itemSet.items.map((itemSetItem, itemSetItemIndex) => (
            <React.Fragment>
              <input
                value={itemSetItem.name}
                data-item-set-index={itemSetIndex}
                data-item-set-item-index={itemSetItemIndex}
                onChange={handleEditItemNameChange}
                list={`${itemSetItem.id}List`}
              />
              <datalist id={`${itemSetItem.id}List`}>
                {items.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </datalist>

              <button
                className="remove"
                data-item-set-index={itemSetIndex}
                data-item-set-item-index={itemSetItemIndex}
                onClick={handleEditItemRemove}
              >
                Remove
              </button>
            </React.Fragment>
          ))}

          <label htmlFor={`${itemSetIndex}Optional`} className="optional">
            Optional
            <input
              type="checkbox"
              id={`${itemSetIndex}Optional`}
              checked={itemSet.optional}
              data-item-set-index={itemSetIndex}
              onChange={handleEditItemOptionalChange}
            />
          </label>

          <button data-item-set-index={itemSetIndex} onClick={addEditItemSetItem}>
            Add substitute
          </button>
          <br />
        </React.Fragment>
      ))}
      <button onClick={handleEditItemAdd}>Add Item</button>
      <button onClick={cancelEditDish}>Cancel</button>
      <button onClick={saveEditDish}>Save</button>
    </div>
  </form>
);

export default EditDish;
