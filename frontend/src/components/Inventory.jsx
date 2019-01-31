/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };

    this.showItemDishes = this.showItemDishes.bind(this);
  }

  componentDidMount() {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((inventoryItems) => {
        this.setState({ inventoryItems, loading: false });
      });
  }

  showItemDishes(event) {
    const { id } = event.target.dataset;
    const { inventoryItems } = this.state;
    const selectedItem = inventoryItems.filter((item) => item.id === parseInt(id, 10))[0];
    this.setState({ selectedItem });
  }

  render() {
    const { inventoryItems, selectedItem } = this.state;

    if (this.state.loading) return <div>Loading...</div>;

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

                  <button>Remove</button>
                </li>
              ))}
            </ul>

            <form>
              <h3>Add Item</h3>
              <label htmlFor="name">
                Name
                <input type="text" name="name" />
              </label>
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

  ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

export default Inventory;
