/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';

import DishList from './DishList';
import AddDish from './AddDish';
import DishItemList from './DishItemList';

class Dishes extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };

    this.showDishItems = this.showDishItems.bind(this);
    this.addItemSet = this.addItemSet.bind(this);
    this.addItemSetItem = this.addItemSetItem.bind(this);
    this.saveDish = this.saveDish.bind(this);
    this.editDish = this.editDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveEditDish = this.saveEditDish.bind(this);
    this.cancelEditDish = this.cancelEditDish.bind(this);
    this.saveNewDish = this.saveNewDish.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.handleTagFilterAll = this.handleTagFilterAll.bind(this);
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
          const { filteredDishTags = [] } = this.state;
          console.log('filteredDishTags', filteredDishTags);

          // Keep a copy of unfiltered dishes
          const allDishes = dishes;

          // Filter dishes by current tag filters
          let filteredDishes = [];
          if (filteredDishTags.length > 0) {
            dishes.forEach((dish) => {
              dish.tags.forEach((tag) => {
                if (filteredDishTags.includes(tag.name)) {
                  filteredDishes.push(dish);
                }
              });
            });
          } else {
            filteredDishes = filteredDishes.concat(dishes);
          }

          this.setState({ dishes: filteredDishes, allDishes });
        }),
      fetch('/api/items')
        .then((res) => res.json())
        .then((items) => {
          this.setState({ items });
        }),
      fetch('/api/dishtags')
        .then((res) => res.json())
        .then((dishTags) => {
          const { filteredDishTags = [] } = this.state;
          this.setState({ dishTags, filteredDishTags });
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

    // Deep clone
    const editDishItemSets = dishForEdit.itemSets.map((itemSet) => ({
      id: itemSet.id,
      optional: itemSet.optional,
      items: itemSet.items.map((item) => ({ id: item.id, name: item.name })),
    }));

    const editDishTags = dishForEdit.tags.map((tag) => tag.name);

    this.setState({ editDishName: name, editDishID: parseInt(id, 10), editDishItemSets, editDishTags });
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
  //  HANDLE EDIT DISH ADD TAG
  //----------------------------------------------------------------------------------
  handleEditDishAddTag(event) {
    event.preventDefault();
    const { editDishTags } = this.state;
    console.log(editDishTags);
    editDishTags.push('');
    this.setState({ editDishTags });
  }

  //
  //  HANDLE EDIT DISH TAG INPUT
  //----------------------------------------------------------------------------------
  handleEditDishTagInput(event) {
    const { value } = event.target;
    const { index } = event.target.dataset;
    const { editDishTags } = this.state;

    editDishTags[index] = value;
    this.setState({ editDishTags });
  }

  //
  //  HANDLE EDIT DISH REMOVE TAG
  //----------------------------------------------------------------------------------
  handleEditDishRemoveTag(event) {
    event.preventDefault();
    const { index } = event.target.dataset;
    const { editDishTags } = this.state;

    editDishTags.splice(index, 1);
    this.setState({ editDishTags });
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
  //  ADD DISH ADD TAG
  //----------------------------------------------------------------------------------
  addDishAddTag(event) {
    event.preventDefault();
    const { newDishTags } = this.state;
    newDishTags.push('');
    this.setState(newDishTags);
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
  saveEditDish(data) {
    const { items, dishTags, editDishID } = this.state;
    const saveData = data;

    saveData.items = items;
    saveData.dishTags = dishTags;
    saveData.editDishID = editDishID;

    fetch('/api/dishes/editdish', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        this.fetchData();
        this.setState({
          editDishName: '',
          editDishID: '',
          editDishItems: [],
          editDishTags: [],
          selectedDish: null,
        });
      }
    });
  }

  //
  //  CANCEL EDIT DISH
  //----------------------------------------------------------------------------------
  cancelEditDish() {
    this.setState({ editDishID: '', editDishname: '', editDishItemSets: [], editDishTags: [] });
  }

  saveNewDish(data) {
    const { items } = this.state;
    const saveData = data;

    saveData.items = items;

    fetch('/api/dishes/savedish', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        this.fetchData();
      }
    });
  }

  //
  //  HANDLE TAG FILTER
  //----------------------------------------------------------------------------------
  handleTagFilter(event) {
    const { name } = event.target.dataset;
    const { filteredDishTags, allDishes } = this.state;

    if (filteredDishTags.includes(name)) {
      filteredDishTags.splice(filteredDishTags.indexOf(name), 1);
    } else {
      filteredDishTags.push(name);
    }

    const filteredDishes = [];

    allDishes.forEach((dish) => {
      dish.tags.every((tag) => {
        if (filteredDishTags.includes(tag.name)) {
          filteredDishes.push(dish);
          return false;
        }
        return true;
      });
    });

    this.setState({ filteredDishTags, dishes: filteredDishes });
  }

  //
  //  HANDLE TAG FILTER ALL
  //----------------------------------------------------------------------------------
  handleTagFilterAll() {
    const { allDishes } = this.state;
    this.setState({ filteredDishTags: [], dishes: allDishes });
  }

  //
  //  RENDER
  //----------------------------------------------------------------------------------
  render() {
    const {
      loading,
      items,
      dishes,
      dishTags,
      filteredDishTags,
      selectedDish,
      editDishID,
      editDishName,
      editDishTags,
      editDishItemSets,
    } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <StyledDishes>
        <h1>Dishes</h1>
        <AddDish items={items} dishTags={dishTags} save={this.saveNewDish} />
        <div className="container">
          <div className="tags">
            <h4>Tags</h4>
            <label htmlFor="tag0">
              <input
                type="checkbox"
                id="tag0"
                onChange={this.handleTagFilterAll}
                checked={filteredDishTags.length === 0}
              />
              All
            </label>
            <br />
            {dishTags.map((tag) => (
              <React.Fragment>
                <label htmlFor={`tag${tag.id}`}>
                  <input
                    type="checkbox"
                    id={`tag${tag.id}`}
                    onChange={this.handleTagFilter}
                    data-name={tag.name}
                    checked={filteredDishTags.includes(tag.name)}
                  />
                  {tag.name}
                </label>
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="dish-list">
            <DishList
              dishes={dishes}
              items={items}
              dishTags={dishTags}
              editDishID={editDishID}
              editDishName={editDishName}
              editDishTags={editDishTags}
              editDishItemSets={editDishItemSets}
              showDishItems={this.showDishItems}
              editDish={this.editDish}
              cancelEditDish={this.cancelEditDish}
              saveEditDish={this.saveEditDish}
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
  padding: 0 30px;

  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 2fr;
  }
`;

export default Dishes;
