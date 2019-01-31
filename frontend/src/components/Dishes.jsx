/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';

class Dishes extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, newDishName: '', newDishItems: [] };

    this.showDishItems = this.showDishItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.saveDish = this.saveDish.bind(this);
    this.handleDishNameChange = this.handleDishNameChange.bind(this);
    this.handleItemNameChange = this.handleItemNameChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const fetches = [
      fetch('/api/dishes')
        .then((res) => res.json())
        .then((dishes) => {
          this.setState({ dishes });
        }),
      fetch('/api/items')
        .then((res) => res.json())
        .then((items) => {
          this.setState({ items });
        }),
    ];

    Promise.all(fetches).then(() => this.setState({ loading: false }));
  }

  showDishItems(event) {
    const { id } = event.target.dataset;
    const { dishes } = this.state;
    const selectedDish = dishes.filter((dish) => dish.id === parseInt(id, 10))[0];
    this.setState({ selectedDish });
  }

  handleDishNameChange(event) {
    const { value } = event.target;
    this.setState({ newDishName: value });
  }

  addItem() {
    const { newDishItems } = this.state;
    newDishItems.push({ name: '', key: Date.now() });
    this.setState({ newDishItems });
  }

  handleItemNameChange(event) {
    const { value } = event.target;
    const { index } = event.target.dataset;
    const { newDishItems } = this.state;
    newDishItems[index].name = value;
    this.setState({ newDishItems });
  }

  saveDish(event) {
    event.preventDefault();
    console.log('saving');
    fetch('/api/dishes/savedish', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) =>
      res.json().then((resJSON) => {
        console.log(resJSON);
        if (res.ok) {
          this.fetchData();
          this.setState({
            newDishName: '',
            newDishItems: [],
          });
        }
      })
    );
  }

  render() {
    const { loading, dishes, selectedDish, newDishName, newDishItems } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledDishes>
        <h1>Dishes</h1>
        <div className="container">
          <div className="dish-list">
            <ul>
              {dishes.map((dish) => (
                <button key={dish.id} data-id={dish.id} onClick={this.showDishItems}>
                  {dish.name}
                </button>
              ))}
            </ul>

            <form>
              <h3>Add dish</h3>
              <label htmlFor="name">
                Name
                <input type="text" name="newDishName" value={newDishName} onChange={this.handleDishNameChange} />
              </label>

              {newDishItems.map((item, index) => (
                <div key={item.key}>
                  <input type="text" value={item.name} data-index={index} onChange={this.handleItemNameChange} />
                </div>
              ))}

              <button type="button" onClick={this.addItem}>
                Add item
              </button>

              <button type="submit" onClick={this.saveDish}>
                Save
              </button>
            </form>
          </div>

          <div className="item-list">
            <h4>Items</h4>
            {selectedDish && (
              <ul>
                {selectedDish.items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </StyledDishes>
    );
  }
}

const StyledDishes = styled.div`
  max-width: 1000px;
  margin: 0 auto;

  .container {
    display: grid;
    grid-template-columns: 4fr 2fr;
  }

  button {
    display: block;
  }
`;

export default Dishes;
