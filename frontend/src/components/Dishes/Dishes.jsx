/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';

import DishList from './DishList';
import AddDish from './AddDish';
import DishItemList from './DishItemList';

class Dishes extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, newDishName: '', newDishItemSets: [] };

    this.showDishItems = this.showDishItems.bind(this);
    this.addItemSet = this.addItemSet.bind(this);
    this.addItemSetItem = this.addItemSetItem.bind(this);
    this.saveDish = this.saveDish.bind(this);
    this.handleDishNameChange = this.handleDishNameChange.bind(this);
    this.handleItemNameChange = this.handleItemNameChange.bind(this);
    this.handleItemOptionalChange = this.handleItemOptionalChange.bind(this);
    this.handleRemoveSubstitute = this.handleRemoveSubstitute.bind(this);
    this.editDish = this.editDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditItemNameChange = this.handleEditItemNameChange.bind(this);
    this.handleEditItemOptionalChange = this.handleEditItemOptionalChange.bind(this);
    this.handleEditItemRemove = this.handleEditItemRemove.bind(this);
    this.handleEditItemAdd = this.handleEditItemAdd.bind(this);
    this.addEditItemSetItem = this.addEditItemSetItem.bind(this);
    this.saveEditDish = this.saveEditDish.bind(this);
    this.cancelEditDish = this.cancelEditDish.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  //
  //  FETCH DATA
  //----------------------------------------------------------------------------------
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

  //
  //  SHOW DISH ITEMS
  //----------------------------------------------------------------------------------
  showDishItems(event) {
    const { id } = event.target.dataset;
    const { dishes } = this.state;
    const selectedDish = dishes.filter((dish) => dish.id === parseInt(id, 10))[0];
    this.setState({ selectedDish });
  }

  //
  //  HANDLE DISH NAME CHANGE
  //----------------------------------------------------------------------------------
  // TODO: merge this into handleChange
  handleDishNameChange(event) {
    const { value } = event.target;
    this.setState({ newDishName: value });
  }

  //
  //  ADD ITEM SET
  //----------------------------------------------------------------------------------
  addItemSet() {
    const { newDishItemSets } = this.state;
    newDishItemSets.push({ items: [{ name: '', id: Date.now() }], optional: '', id: Date.now() });
    this.setState({ newDishItemSets });
  }

  //
  //  ADD ITEM SET ITEM
  //----------------------------------------------------------------------------------
  addItemSetItem(event) {
    event.preventDefault();
    const { itemSetIndex } = event.target.dataset;
    const { newDishItemSets } = this.state;
    newDishItemSets[itemSetIndex].items.push({ name: '', id: Date.now() });
    this.setState({ newDishItemSets });
  }

  //
  //  HANDLE ITEM NAME CHANGE
  //----------------------------------------------------------------------------------
  handleItemNameChange(event) {
    const { value } = event.target;
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { newDishItemSets } = this.state;
    newDishItemSets[itemSetIndex].items[itemSetItemIndex].name = value;
    this.setState({ newDishItemSets });
  }

  //
  //  HANDLE ITEM OPTIONAL CHANGE
  //----------------------------------------------------------------------------------
  handleItemOptionalChange(event) {
    const { itemSetIndex } = event.target.dataset;
    const { newDishItemSets } = this.state;
    newDishItemSets[itemSetIndex].optional = !newDishItemSets[itemSetIndex].optional;
    this.setState({ newDishItemSets });
  }

  //
  //  HANDLE REMOVE SUBSTITUTE
  //----------------------------------------------------------------------------------
  handleRemoveSubstitute(event) {
    event.preventDefault();
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { newDishItemSets } = this.state;

    if (newDishItemSets[itemSetIndex].items.length === 1) {
      newDishItemSets.splice(itemSetIndex, 1);
    } else {
      newDishItemSets[itemSetIndex].items.splice(itemSetItemIndex, 1);
    }

    this.setState({ newDishItemSets });
  }

  //
  //  SAVE DISH
  //----------------------------------------------------------------------------------
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
            newDishItemSets: [],
          });
        }
      })
    );
  }

  //
  //  EDIT DISH
  //----------------------------------------------------------------------------------
  editDish(event) {
    const { id, name } = event.target.dataset;
    const { dishes } = this.state;
    const dishForEdit = dishes.filter((dish) => dish.id === parseInt(id, 10))[0];
    const editDishItemSets = dishForEdit.itemSets.map((itemSet) => ({
      id: itemSet.id,
      optional: itemSet.optional,
      items: itemSet.items.map((item) => ({ id: item.id, name: item.name })),
    }));
    this.setState({ editDishName: name, editDishID: parseInt(id, 10), editDishItemSets });
  }

  //
  //  HANDLE CHANGE
  //----------------------------------------------------------------------------------
  handleChange(event) {
    const { value, name, type } = event.target;
    const val = type === 'number' ? parseFloat(value) || '' : value;
    this.setState({ [name]: val });
  }

  //
  //  HANDLE EDIT ITEM NAME CHANGE
  //----------------------------------------------------------------------------------
  handleEditItemNameChange(event) {
    const { value } = event.target;
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { editDishItemSets } = this.state;

    editDishItemSets[itemSetIndex].items[itemSetItemIndex].name = value;

    this.setState({ editDishItemSets });
  }

  //
  //  HANDLE EDIT ITEM OPTIONAL CHANGE
  //----------------------------------------------------------------------------------
  handleEditItemOptionalChange(event) {
    const { itemSetIndex } = event.target.dataset;
    const { editDishItemSets } = this.state;
    editDishItemSets[itemSetIndex].optional = !editDishItemSets[itemSetIndex].optional;
    this.setState({ editDishItemSets });
  }

  //
  //  HANDLE EDIT ITEM REMOVE
  //----------------------------------------------------------------------------------
  handleEditItemRemove(event) {
    event.preventDefault();
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { editDishItemSets } = this.state;

    if (editDishItemSets[itemSetIndex].items.length === 1) {
      editDishItemSets.splice(itemSetIndex, 1);
    } else {
      editDishItemSets[itemSetIndex].items.splice(itemSetItemIndex, 1);
    }

    this.setState({ editDishItemSets });
  }

  //
  //  HANDLE EDIT ITEM ADD
  //----------------------------------------------------------------------------------
  handleEditItemAdd(event) {
    event.preventDefault();
    const { editDishItemSets } = this.state;

    editDishItemSets.push({ items: [{ name: '', id: Date.now() }], optional: '', id: Date.now() });
    this.setState({ editDishItemSets });
  }

  //
  //  ADD EDIT ITEM SET ITEM
  //----------------------------------------------------------------------------------
  addEditItemSetItem(event) {
    event.preventDefault();
    const { itemSetIndex } = event.target.dataset;
    const { editDishItemSets } = this.state;
    editDishItemSets[itemSetIndex].items.push({ name: '', id: Date.now() });
    this.setState({ editDishItemSets });
  }

  //
  //  SAVE EDIT DISH
  //----------------------------------------------------------------------------------
  saveEditDish(event) {
    event.preventDefault();

    const { editDishID, editDishName, editDishItemSets, items } = this.state;

    const saveData = {
      editDishID,
      editDishName,
      editDishItemSets,
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

  //
  //  CANCEL EDIT DISH
  //----------------------------------------------------------------------------------
  cancelEditDish() {
    this.setState({ editDishID: '', editDishItemSets: [] });
  }

  //
  //  RENDER
  //----------------------------------------------------------------------------------
  render() {
    const {
      loading,
      items,
      dishes,
      selectedDish,
      newDishName,
      newDishItemSets,
      editDishID,
      editDishName,
      editDishItemSets,
    } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledDishes>
        <h1>Dishes</h1>
        <div className="container">
          <div className="dish-list">
            <DishList
              dishes={dishes}
              items={items}
              editDishID={editDishID}
              editDishName={editDishName}
              editDishItemSets={editDishItemSets}
              showDishItems={this.showDishItems}
              editDish={this.editDish}
              handleChange={this.handleChange}
              handleEditItemAdd={this.handleEditItemAdd}
              handleEditItemNameChange={this.handleEditItemNameChange}
              handleEditItemRemove={this.handleEditItemRemove}
              handleEditItemOptionalChange={this.handleEditItemOptionalChange}
              addEditItemSetItem={this.addEditItemSetItem}
              cancelEditDish={this.cancelEditDish}
              saveEditDish={this.saveEditDish}
            />
            <AddDish
              items={items}
              newDishName={newDishName}
              newDishItemSets={newDishItemSets}
              handleDishNameChange={this.handleDishNameChange}
              handleItemNameChange={this.handleItemNameChange}
              handleRemoveSubstitute={this.handleRemoveSubstitute}
              addItemSetItem={this.addItemSetItem}
              handleItemOptionalChange={this.handleItemOptionalChange}
              addItemSet={this.addItemSet}
              saveDish={this.saveDish}
            />
          </div>

          <div className="item-list">
            <DishItemList selectedDish={selectedDish} />
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
`;

export default Dishes;
