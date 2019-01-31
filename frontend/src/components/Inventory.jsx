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
      newItemShelflife: '',
    };

    this.showItemDishes = this.showItemDishes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveItem = this.saveItem.bind(this);
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
          this.setState({ inventoryItems });
        }),
      fetch('/api/items')
        .then((res) => res.json())
        .then((items) => {
          this.setState({ items });
        }),
    ];

    Promise.all(fetches).then(() => this.setState({ loading: false }));
  }

  deleteItem(event) {
    const { id } = event.target.dataset;
    fetch('/api/inventory/deleteitem', {
      method: 'POST',
      body: JSON.stringify({ itemID: parseInt(id, 10) }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) =>
      res.json().then((resJSON) => {
        console.log(resJSON);
        if (res.ok) {
          this.fetchData();
        }
      })
    );
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
    fetch('/api/inventory/saveitem', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) =>
      res.json().then((resJSON) => {
        console.log(resJSON);
        if (res.ok) {
          this.fetchData();
          this.setState({
            newItemName: '',
            newItemAddDate: moment(Date.now()).format('M-DD-YYYY'),
            newItemShelflife: '',
          });
        }
      })
    );
  }

  render() {
    const { loading, inventoryItems, selectedItem, newItemName, newItemAddDate, newItemShelflife } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledInventory>
        <h1>Inventory</h1>
        <div className="container">
          <div className="item-list">
            <ul>
              <li>
                <span>Name</span>
                <span>Expires</span>
              </li>

              {inventoryItems.map((item) => (
                <li key={item.id}>
                  <button data-id={item.id} onClick={this.showItemDishes}>
                    {item.name}
                  </button>

                  <span>
                    {moment(item.add_date)
                      .add(item.shelflife, 'days')
                      .fromNow()}
                  </span>

                  <button data-id={item.id} onClick={this.deleteItem}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <form>
              <h3>Add Item</h3>
              <label htmlFor="name">
                Name
                <input type="text" name="newItemName" value={newItemName} onChange={this.handleChange} />
              </label>

              <label htmlFor="addDate">
                Add date
                <input type="text" name="newItemAddDate" value={newItemAddDate} onChange={this.handleChange} />
              </label>

              <label htmlFor="shelflife">
                Shelflife (days)
                <input type="number" name="newItemShelflife" value={newItemShelflife} onChange={this.handleChange} />
              </label>

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
  max-width: 1000px;
  margin: 0 auto;

  .container {
    display: grid;
    grid-template-columns: 4fr 2fr;
  }

  .item-list ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  label {
    display: block;
  }
`;

export default Inventory;
