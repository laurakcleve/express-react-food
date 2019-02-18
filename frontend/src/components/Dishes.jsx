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
    this.editDish = this.editDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditItemNameChange = this.handleEditItemNameChange.bind(this);
    this.handleEditItemRemove = this.handleEditItemRemove.bind(this);
    this.handleEditItemAdd = this.handleEditItemAdd.bind(this);
    this.saveEditDish = this.saveEditDish.bind(this);
    this.cancelEditDish = this.cancelEditDish.bind(this);
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

  editDish(event) {
    const { id, name } = event.target.dataset;
    const { dishes } = this.state;
    const editDishItems = dishes.filter((dish) => dish.id === parseInt(id, 10))[0].items.map((item) => item.name);
    this.setState({ editDishName: name, editDishID: parseInt(id, 10), editDishItems });
  }

  handleChange(event) {
    const { value, name, type } = event.target;
    const val = type === 'number' ? parseFloat(value) || '' : value;
    this.setState({ [name]: val });
  }

  handleEditItemNameChange(event) {
    const { value } = event.target;
    const { index } = event.target.dataset;
    const { editDishItems } = this.state;

    editDishItems[index] = value;

    this.setState({ editDishItems });
  }

  handleEditItemRemove(event) {
    event.preventDefault();

    const { index } = event.target.dataset;
    const { editDishItems } = this.state;

    editDishItems.splice(index, 1);

    this.setState({ editDishItems });
  }

  handleEditItemAdd(event) {
    event.preventDefault();

    const { editDishItems } = this.state;

    editDishItems.push('');

    this.setState({ editDishItems });
  }

  saveEditDish(event) {
    event.preventDefault();

    const { editDishID, editDishName, editDishItems, items } = this.state;

    const saveData = {
      editDishID,
      editDishName,
      editDishItems,
      items,
    };

    fetch('/api/dishes/editdish', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) =>
      res.json().then((resJSON) => {
        console.log(resJSON);
        if (res.ok) {
          this.fetchData();
          this.setState({
            editDishName: '',
            editDishID: '',
            editDishItems: [],
            selectedDish: null,
          });
        }
      })
    );
  }

  cancelEditDish() {
    this.setState({ editDishID: '' });
  }

  render() {
    const {
      loading,
      items,
      dishes,
      selectedDish,
      newDishName,
      newDishItems,
      editDishID,
      editDishName,
      editDishItems,
    } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledDishes>
        <h1>Dishes</h1>
        <div className="container">
          <div className="dish-list">
            <ul>
              {dishes.map((dish) => (
                <li key={dish.id}>
                  <button data-id={dish.id} onClick={this.showDishItems}>
                    {dish.name}
                  </button>
                  <button onClick={this.editDish} data-id={dish.id} data-name={dish.name}>
                    Edit
                  </button>

                  {editDishID === dish.id && (
                    <form>
                      <label htmlFor="editDishName">
                        Name
                        <input type="text" name="editDishName" value={editDishName} onChange={this.handleChange} />
                      </label>

                      <br />
                      <div>
                        Items
                        <br />
                        {editDishItems.map((item, index) => (
                          <React.Fragment>
                            <input value={item} data-index={index} onChange={this.handleEditItemNameChange} />
                            <button onClick={this.handleEditItemRemove} data-index={index}>
                              Remove
                            </button>
                          </React.Fragment>
                        ))}
                        <button onClick={this.handleEditItemAdd}>Add Item</button>
                        <button onClick={this.cancelEditDish}>Cancel</button>
                        <button onClick={this.saveEditDish}>Save</button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>

            <form>
              <h3>Add dish</h3>
              <label htmlFor="name">
                Name
                <input type="text" name="newDishName" value={newDishName} onChange={this.handleDishNameChange} />
              </label>

              {newDishItems.map((newDishItem, index) => (
                <div key={newDishItem.key}>
                  <input
                    type="text"
                    value={newDishItem.name}
                    data-index={index}
                    onChange={this.handleItemNameChange}
                    list={`${newDishItem.key}List`}
                  />

                  <datalist id={`${newDishItem.key}List`}>
                    {items.map((item) => (
                      <option key={item.id}>{item.name}</option>
                    ))}
                  </datalist>
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
    max-width: 200px;
  }

  ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export default Dishes;
