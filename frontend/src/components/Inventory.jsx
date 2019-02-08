/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      newItemName: '',
      newItemAddDate: moment(Date.now()).format('M-D-YYYY'),
      newItemDaysLeft: '',
    };

    this.showItemDishes = this.showItemDishes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.cancelEditItem = this.cancelEditItem.bind(this);
    this.saveEditItem = this.saveEditItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const fetches = [
      fetch('/api/inventory')
        .then((res) => res.json())
        .then((inventoryItems) => {
          const sortedItems = [].concat(inventoryItems).sort(
            (a, b) =>
              moment(a.add_date)
                .add(a.shelflife, 'days')
                .valueOf() -
              moment(b.add_date)
                .add(b.shelflife, 'days')
                .valueOf()
          );
          this.setState({ inventoryItems: sortedItems });
        }),

      fetch('/api/items')
        .then((res) => res.json())
        .then((items) => {
          this.setState({ items });
        }),

      fetch('/api/itemlocations')
        .then((res) => res.json())
        .then((itemLocations) => {
          this.setState({ itemLocations });
        }),
    ];

    Promise.all(fetches).then(() => this.setState({ loading: false }));
  }

  editItem(event) {
    const { id, name, addDate, amount, shelflife } = event.target.dataset;

    const editItemAddDate = addDate ? moment(addDate).format('MMM D YYYY') : '';

    this.setState({
      editItemID: parseInt(id, 10),
      editItemName: name,
      editItemAddDate,
      editItemAmount: amount,
      editItemDaysLeft: shelflife,
    });
  }

  cancelEditItem() {
    this.setState({
      editItemID: '',
      editItemName: '',
      editItemAmount: '',
      editItemAddDate: '',
      editItemDaysLeft: '',
    });
  }

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
    }).then((res) =>
      res.json().then((resJSON) => {
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
      })
    );
  }

  render() {
    const {
      loading,
      items,
      inventoryItems,
      itemLocations,
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
          <div className="item-list">
            <ul>
              <li>
                <span>Name</span>
                <span>Location</span>
                <span>Amount</span>
                <span>Expires</span>
              </li>

              {inventoryItems.map((inventoryItem) => (
                <li key={inventoryItem.id}>
                  <button data-id={inventoryItem.id} onClick={this.showItemDishes}>
                    {inventoryItem.name}
                  </button>

                  <span>{inventoryItem.location}</span>

                  <span>{inventoryItem.amount}</span>

                  <span>
                    {moment(inventoryItem.add_date)
                      .add(inventoryItem.shelflife, 'days')
                      .fromNow()}
                  </span>

                  <button
                    data-id={inventoryItem.id}
                    data-name={inventoryItem.name}
                    data-add-date={inventoryItem.add_date}
                    data-amount={inventoryItem.amount}
                    data-shelflife={inventoryItem.shelflife}
                    onClick={this.editItem}
                  >
                    Edit
                  </button>

                  <button data-id={inventoryItem.id} onClick={this.deleteItem}>
                    Remove
                  </button>

                  {editItemID === inventoryItem.id && (
                    <form>
                      <label htmlFor="editItemName">
                        Name
                        <input
                          type="text"
                          name="editItemName"
                          value={editItemName}
                          onChange={this.handleChange}
                          list="itemList"
                        />
                        <datalist id="itemList">
                          {items.map((item) => (
                            <option key={item.id}>{item.name}</option>
                          ))}
                        </datalist>
                      </label>

                      <label htmlFor="editItemAddDate">
                        Add date
                        <input
                          type="text"
                          name="editItemAddDate"
                          value={editItemAddDate}
                          onChange={this.handleChange}
                        />
                      </label>

                      <label htmlFor="editItemAmount">
                        Amount
                        <input type="text" name="editItemAmount" value={editItemAmount} onChange={this.handleChange} />
                      </label>

                      <label htmlFor="editItemLocation">
                        Location
                        <input
                          type="text"
                          name="editItemLocation"
                          value={editItemLocation}
                          onChange={this.handleChange}
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
                        <input
                          type="number"
                          name="editItemDaysLeft"
                          value={editItemDaysLeft}
                          onChange={this.handleChange}
                        />
                      </label>

                      <button onClick={this.cancelEditItem}>Cancel</button>

                      <button type="submit" onClick={this.saveEditItem}>
                        Save
                      </button>
                    </form>
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

          <div className="dish-list">
            <h4>Dishes</h4>
            {selectedItem && (
              <ul>
                {selectedItem.dishes.map((dish) => (
                  <li key={dish.id}>{dish.name}</li>
                ))}
              </ul>
            )}
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
    grid-template-columns: 4fr 2fr;
  }

  .item-list ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }
  }

  label {
    display: block;
  }
`;

export default Inventory;
