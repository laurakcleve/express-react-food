import React, { Component } from 'react';

const EditInventoryItem = ({
  items,
  itemLocations,
  editItemName,
  editItemAddDate,
  editItemAmount,
  editItemLocation,
  editItemDaysLeft,
  handleChange,
  cancelEditItem,
  saveEditItem,
}) => (
  <form>
    <label htmlFor="editItemName">
      Name
      <input type="text" name="editItemName" value={editItemName} onChange={handleChange} list="itemList" />
      <datalist id="itemList">
        {items.map((item) => (
          <option key={item.id}>{item.name}</option>
        ))}
      </datalist>
    </label>

    <label htmlFor="editItemAddDate">
      Add date
      <input type="text" name="editItemAddDate" value={editItemAddDate} onChange={handleChange} />
    </label>

    <label htmlFor="editItemAmount">
      Amount
      <input type="text" name="editItemAmount" value={editItemAmount} onChange={handleChange} />
    </label>

    <label htmlFor="editItemLocation">
      Location
      <input
        type="text"
        name="editItemLocation"
        value={editItemLocation}
        onChange={handleChange}
        list="itemLocationList"
      />
    </label>
    <datalist id="itemLocationList">
      {itemLocations.map((itemLocation) => (
        <option key={itemLocation.id}>{itemLocation.name}</option>
      ))}
    </datalist>

    <label htmlFor="editItemDaysLeft">
      Days left
      <input type="number" name="editItemDaysLeft" value={editItemDaysLeft} onChange={handleChange} />
    </label>

    <button onClick={cancelEditItem}>Cancel</button>

    <button type="submit" onClick={saveEditItem}>
      Save
    </button>
  </form>
);

export default EditInventoryItem;
