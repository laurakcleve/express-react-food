import React, { Component } from 'react';
import styled from 'styled-components';

import DishForm from './DishForm';

class AddDish extends Component {
  constructor(props) {
    super(props);
    this.state = { open: true };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleOpen(event) {
    event.preventDefault();
    this.setState({ open: true });
  }

  handleClose(event) {
    event.preventDefault();
    this.setState({ open: false });
  }

  cancel() {
    this.setState({ open: false });
  }

  render() {
    const { items, dishTags, save } = this.props;

    return (
      <StyledAddDish>
        <button className="add-dish" onClick={this.handleOpen}>
          +
        </button>
        {this.state.open && <DishForm items={items} dishTags={dishTags} cancel={this.cancel} save={save} />}
      </StyledAddDish>
    );
  }
}

const StyledAddDish = styled.div`
  /* button {
    width: 80px;
    height: 25px;
    margin-right: 10px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase; */

    /* &.add-dish {
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
    } */
  }

  /* form {
    margin-top: 20px;
  } */
`;

export default AddDish;
