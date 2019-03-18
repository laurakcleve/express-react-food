import React, { Component } from 'react';
import styled from 'styled-components';

import ItemSet from './ItemSet';

class AddDish extends Component {
  constructor(props) {
    super(props);
    this.state = { open: true };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen(event) {
    event.preventDefault();
    this.setState({ open: true });
  }

  handleClose(event) {
    event.preventDefault();
    this.setState({ open: false });
  }

  render() {
    const {
      items,
      newDishName,
      newDishItemSets,
      handleDishNameChange,
      handleItemNameChange,
      handleRemoveSubstitute,
      addItemSetItem,
      handleItemOptionalChange,
      addItemSet,
      saveDish,
    } = this.props;

    return (
      <StyledAddDish>
        <button className="add-dish" onClick={this.handleOpen}>
          +
        </button>
        <form>
          {this.state.open && (
            <React.Fragment>
              <label htmlFor="name">
                <input
                  className="name"
                  type="text"
                  placeholder="Name"
                  name="newDishName"
                  value={newDishName}
                  onChange={handleDishNameChange}
                />
              </label>

              {newDishItemSets.map((newDishItemSet, itemSetIndex) => (
                <ItemSet
                  key={newDishItemSet.id}
                  items={items}
                  newDishItemSet={newDishItemSet}
                  itemSetIndex={itemSetIndex}
                  handleItemNameChange={handleItemNameChange}
                  handleItemOptionalChange={handleItemOptionalChange}
                  handleRemoveSubstitute={handleRemoveSubstitute}
                  addItemSetItem={addItemSetItem}
                />
              ))}

              <button type="button" className="add-item" onClick={addItemSet}>
                + item
              </button>

              <button type="button" className="cancel" onClick={this.handleClose}>
                Cancel
              </button>

              <button type="submit" className="save" onClick={saveDish}>
                Save
              </button>
            </React.Fragment>
          )}
        </form>
      </StyledAddDish>
    );
  }
}

const StyledAddDish = styled.div`
  button {
    width: 80px;
    height: 25px;
    margin-right: 10px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;

    &.add-dish {
      display: block;
      background-color: #bba8d6;
      border: none;
      color: #fff;
      width: 140px;
      height: 25px;
      font-weight: bold;
      font-size: 18px;

      &:focus {
        outline: none;
      }
    }

    &.add-item {
      display: block;
      margin-bottom: 20px;
      background-color: #d9cee8;
      color: #7e688e;
      border: none;
      text-transform: uppercase;
      font-weight: bold;
    }

    &.cancel {
      background-color: transparent;
      border: 1px solid #cbbce0;
      border-radius: 7px;
      color: #7e688e;
    }

    &.save {
      background-color: #bba8d6;
      color: #fff;
      letter-spacing: 1px;
    }
  }

  form {
    margin-top: 20px;
  }

  input.name {
    display: block;
    width: 250px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #505050;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;

export default AddDish;
