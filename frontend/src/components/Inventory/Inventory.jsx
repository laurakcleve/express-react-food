/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import EditInventoryItem from './EditInventoryItem';

class Inventory extends Component {
  static sortItems(items, sortBy, sortOrder) {
    const sortComparison = (a, b, sortCategory, order) => {
      let output;

      switch (sortCategory) {
        case 'name':
          if (order === 'asc') {
            if (a.name < b.name) output = -1;
            else if (a.name > b.name) output = 1;
            else output = 0;
          } else if (order === 'desc') {
            if (a.name > b.name) output = -1;
            else if (a.name < b.name) output = 1;
            else output = 0;
          }
          break;
        case 'location':
          if (order === 'asc') {
            if (a.location < b.location) output = -1;
            else if (a.location > b.location) output = 1;
            else output = 0;
          } else if (order === 'desc') {
            if (a.location > b.location) output = -1;
            else if (a.location < b.location) output = 1;
            else output = 0;
          }
          break;
        case 'expiration':
          if (order === 'asc') {
            if (moment(a.expiration).valueOf() < moment(b.expiration).valueOf()) return -1;
            else if (moment(a.expiration).valueOf() > moment(b.expiration).valueOf()) return 1;
            output = 0;
          } else if (order === 'desc') {
            if (moment(a.expiration).valueOf() > moment(b.expiration).valueOf()) return -1;
            else if (moment(a.expiration).valueOf() < moment(b.expiration).valueOf()) return 1;
            output = 0;
          }
          break;
        default:
          break;
      }
      return output;
    };

    const sortedItems = [].concat(items.sort((a, b) => sortComparison(a, b, sortBy, sortOrder)));

    return sortedItems;
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      newItemName: '',
      newItemAddDate: moment(Date.now()).format('M-D-YYYY'),
      newItemDaysLeft: '',
    };

    this.showItemDishes = this.showItemDishes.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.cancelEditItem = this.cancelEditItem.bind(this);
    this.saveEditItem = this.saveEditItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleLocationFilter = this.handleLocationFilter.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  //
  //  FETCH DATA
  //----------------------------------------------------------------------------------
  fetchData() {
    const fetches = [
      fetch('/api/inventory')
        .then((res) => res.json())
        .then((inventoryItems) => {
          const { filteredLocations, sortBy = 'expiration', sortOrder = 'asc' } = this.state;

          // Keep a copy of unsorted, unfiltered items
          const allInventoryItems = inventoryItems;

          // Filter items by current filters
          let filteredInventoryItems = [].concat(inventoryItems);
          if (filteredLocations.length > 0) {
            console.log('Filters active: ', filteredLocations);
            filteredInventoryItems = inventoryItems.filter((item) => filteredLocations.includes(item.location));
          }
          // Sort filtered items
          const sortedInventoryItems = Inventory.sortItems(filteredInventoryItems, sortBy, sortOrder);
          this.setState({ inventoryItems: sortedInventoryItems, allInventoryItems, sortBy, sortOrder });
        }),

      fetch('/api/items')
        .then((res) => res.json())
        .then((items) => {
          this.setState({ items });
        }),

      fetch('/api/itemlocations')
        .then((res) => res.json())
        .then((itemLocations) => {
          const { filteredLocations = [] } = this.state;
          this.setState({ itemLocations, filteredLocations });
        }),
    ];

    Promise.all(fetches).then(() => this.setState({ loading: false }));
  }

  //
  //  HANDLE SORT
  //----------------------------------------------------------------------------------
  handleSort(event) {
    const { category } = event.target.dataset;
    const { inventoryItems, sortBy, sortOrder } = this.state;

    let newSortOrder;
    if (category === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortOrder = 'asc';
    }

    const newInventoryItems = Inventory.sortItems(inventoryItems, category, newSortOrder);

    this.setState({ inventoryItems: newInventoryItems, sortBy: category, sortOrder: newSortOrder });
  }

  //
  //  SORT ITEMS
  //----------------------------------------------------------------------------------

  //
  //  EDIT ITEM
  //----------------------------------------------------------------------------------
  editItem(event) {
    const { id, name, addDate, amount, location, expiration } = event.target.dataset;

    const editItemAddDate = addDate ? moment(addDate).format('MMM D YYYY') : '';

    this.setState({
      editItemID: parseInt(id, 10),
      editItemName: name,
      editItemAddDate,
      editItemAmount: amount,
      editItemLocation: location,
      editItemDaysLeft: moment(expiration).diff(moment(), 'days'),
    });
  }

  //
  //  CANCEL EDIT ITEM
  //----------------------------------------------------------------------------------
  cancelEditItem() {
    this.setState({
      editItemID: '',
      editItemName: '',
      editItemAmount: '',
      editItemAddDate: '',
      editItemDaysLeft: '',
    });
  }

  //
  //  SAVE EDIT ITEM
  //----------------------------------------------------------------------------------
  saveEditItem(event) {
    event.preventDefault();

    const {
      editItemID,
      editItemName,
      editItemAddDate,
      editItemAmount,
      editItemLocation,
      editItemDaysLeft,
      items,
      itemLocations,
    } = this.state;

    const editItemExpiration = editItemDaysLeft ? moment().add(editItemDaysLeft, 'days') : null;

    const saveData = {
      editItemID,
      editItemName,
      editItemAddDate,
      editItemAmount,
      editItemLocation,
      editItemExpiration,
      items,
      itemLocations,
    };

    fetch('/api/inventory/edititem', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        this.fetchData();
        this.setState({
          editItemID: '',
          editItemName: '',
          editItemAddDate: '',
          editItemAmount: '',
          editItemLocation: '',
        });
      }
    });
  }

  //
  //  DELETE ITEM
  //----------------------------------------------------------------------------------
  deleteItem(event) {
    const { id } = event.target.dataset;
    fetch('/api/inventory/deleteitem', {
      method: 'POST',
      body: JSON.stringify({ itemID: parseInt(id, 10) }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        this.fetchData();
      }
    });
  }

  //
  //  SHOW ITEM DISHES
  //----------------------------------------------------------------------------------
  showItemDishes(event) {
    const { id } = event.target.dataset;
    const { inventoryItems } = this.state;
    const selectedItem = inventoryItems.filter((item) => item.id === parseInt(id, 10))[0];
    this.setState({ selectedItem });
  }

  handleChange(event) {
    const { value, name, type } = event.target;
    const val = type === 'number' ? parseFloat(value) || '' : value;
    this.setState({ [name]: val });
  }

  //
  //  SAVE ITEM
  //----------------------------------------------------------------------------------
  saveItem(event) {
    event.preventDefault();

    const {
      newItemName,
      newItemAddDate,
      newItemAmount,
      newItemLocation,
      newItemDaysLeft,
      items,
      itemLocations,
    } = this.state;

    const newItemExpiration = moment(newItemAddDate).add(newItemDaysLeft, 'days');

    const saveData = {
      newItemName,
      newItemAddDate,
      newItemAmount,
      newItemLocation,
      newItemExpiration,
      items,
      itemLocations,
    };

    fetch('/api/inventory/saveitem', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        this.fetchData();
        this.setState({
          newItemName: '',
          newItemAddDate: moment(Date.now()).format('M-DD-YYYY'),
          newItemAmount: '',
          newItemLocation: '',
          newItemDaysLeft: '',
        });
      }
    });
  }

  //
  //  HANDLE LOCATION FILTER
  //----------------------------------------------------------------------------------
  handleLocationFilter(event) {
    const { name } = event.target.dataset;
    const { filteredLocations, allInventoryItems, sortBy, sortOrder } = this.state;

    if (filteredLocations.includes(name)) {
      filteredLocations.splice(filteredLocations.indexOf(name), 1);
    } else {
      filteredLocations.push(name);
    }
    const filteredInventoryItems = allInventoryItems.filter((item) => filteredLocations.includes(item.location));
    const sortedInventoryItems = Inventory.sortItems(filteredInventoryItems, sortBy, sortOrder);
    this.setState({ filteredLocations, inventoryItems: sortedInventoryItems });
  }

  //
  //  RENDER
  //----------------------------------------------------------------------------------
  render() {
    const {
      loading,
      items,
      inventoryItems,
      itemLocations,
      filteredLocations,
      selectedItem,
      newItemName,
      newItemAddDate,
      newItemAmount,
      newItemLocation,
      newItemDaysLeft,
      editItemID,
      editItemName,
      editItemAddDate,
      editItemAmount,
      editItemLocation,
      editItemDaysLeft,
    } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledInventory>
        <h1>Inventory</h1>
        <div className="container">
          <div className="location-filter">
            {itemLocations.map((location) => (
              <label htmlFor={`location${location.id}`} key={location.id}>
                <input
                  type="checkbox"
                  id={`location${location.id}`}
                  data-name={location.name}
                  onChange={this.handleLocationFilter}
                  checked={filteredLocations.includes(location.name)}
                />
                {location.name}
              </label>
            ))}
          </div>
          <div className="item-list">
            <ul>
              <li className="header">
                <button onClick={this.handleSort} data-category="name">
                  Name
                </button>
                <button onClick={this.handleSort} data-category="location">
                  Location
                </button>
                <button onClick={this.handleSort} data-category="expiration">
                  Expires
                </button>
                <span>Amount</span>
              </li>

              {inventoryItems.map((inventoryItem) => (
                <li key={inventoryItem.id}>
                  <button className="item-name" data-id={inventoryItem.id} onClick={this.showItemDishes}>
                    {inventoryItem.name}
                  </button>

                  <span>{inventoryItem.location}</span>

                  <span>{moment(inventoryItem.expiration).fromNow()}</span>

                  <span>{inventoryItem.amount}</span>

                  <button
                    className="edit"
                    data-id={inventoryItem.id}
                    data-name={inventoryItem.name}
                    data-add-date={inventoryItem.add_date}
                    data-amount={inventoryItem.amount}
                    data-location={inventoryItem.location}
                    data-expiration={inventoryItem.expiration}
                    onClick={this.editItem}
                  >
                    Edit
                  </button>

                  <button className="delete" data-id={inventoryItem.id} onClick={this.deleteItem}>
                    Remove
                  </button>

                  {editItemID === inventoryItem.id && (
                    <EditInventoryItem
                      items={items}
                      itemLocations={itemLocations}
                      editItemName={editItemName}
                      editItemAddDate={editItemAddDate}
                      editItemAmount={editItemAmount}
                      editItemLocation={editItemLocation}
                      editItemDaysLeft={editItemDaysLeft}
                      handleChange={this.handleChange}
                      cancelEditItem={this.cancelEditItem}
                      saveEditItem={this.saveEditItem}
                    />
                  )}

                  {selectedItem && selectedItem.id === inventoryItem.id && (
                    <div>
                      {selectedItem.dishes.map((dish) => (
                        <p key={dish.id}>{dish.name}</p>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <form>
              <h3>Add Item</h3>
              <label htmlFor="newItemName">
                Name
                <input
                  type="text"
                  name="newItemName"
                  value={newItemName}
                  onChange={this.handleChange}
                  list="itemList"
                />
                <datalist id="itemList">
                  {items.map((item) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
                </datalist>
              </label>

              <label htmlFor="newItemAddDate">
                Add date
                <input type="text" name="newItemAddDate" value={newItemAddDate} onChange={this.handleChange} />
              </label>

              <label htmlFor="newItemAmount">
                Amount
                <input type="text" name="newItemAmount" value={newItemAmount} onChange={this.handleChange} />
              </label>

              <label htmlFor="newItemLocation">
                Location
                <input
                  type="text"
                  name="newItemLocation"
                  value={newItemLocation}
                  onChange={this.handleChange}
                  list="itemLocationList"
                />
              </label>
              <datalist id="itemLocationList">
                {itemLocations.map((itemLocation) => (
                  <option key={itemLocation.id}>{itemLocation.name}</option>
                ))}
              </datalist>

              <label htmlFor="newItemDaysLeft">
                Days left
                <input type="number" name="newItemDaysLeft" value={newItemDaysLeft} onChange={this.handleChange} />
              </label>

              {newItemDaysLeft && (
                <span>
                  (Expiration:{' '}
                  {moment(newItemAddDate)
                    .add(newItemDaysLeft, 'days')
                    .fromNow()}
                  )
                </span>
              )}

              <button type="submit" onClick={this.saveItem}>
                Save
              </button>
            </form>
          </div>
        </div>
      </StyledInventory>
    );
  }
}

const StyledInventory = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  .container {
    display: grid;
    grid-template-columns: 1fr 7fr;
    max-width: 1200px;
    margin: 0 auto;
  }

  .item-list ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: 4fr 4fr 3fr 2fr 1fr 1fr;
      margin-bottom: 3px;
      border-radius: 4px;
      padding: 0px 5px;
      background-color: #fff;
      box-shadow: 1px 1px 3px 0px #e8e8e8;
      font-size: 14px;

      span {
        padding-top: 12px;
      }

      &.header {
        background-color: transparent;
        box-shadow: none;
        text-align: left;
        font-size: 12px;
        margin-bottom: 8px;

        button {
          background-color: transparent;
          border: none;
          text-align: left;
        }

        span {
          padding-top: 0;
        }
      }

      button.edit,
      button.delete {
        background-color: transparent;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 7px;
        padding: 5px 3px;
      }

      button.edit {
      }

      button.delete {
      }
    }
  }

  label {
    display: block;
  }

  button.item-name {
    background-color: transparent;
    border: none;
    font-size: 14px;
    text-align: left;
  }

  .location-filter {
    /* float: left; */
  }
`;

export default Inventory;
