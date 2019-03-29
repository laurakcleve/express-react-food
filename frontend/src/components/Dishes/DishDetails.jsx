import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';

class DishDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { newDate: moment(Date.now()).format('M/D/YY') };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.addDate = this.addDate.bind(this);
    this.isInInventory = this.isInInventory.bind(this);
  }

  handleDateChange(event) {
    const { value } = event.target;
    console.log(value);
    this.setState({ newDate: value });
  }

  addDate(event) {
    event.preventDefault();
    const { newDate } = this.state;
    const data = {
      dishID: this.props.selectedDish.id,
      date: newDate,
    };
    this.props.saveHistoryDate(data);
  }

  isInInventory(item) {
    const { inventoryItems } = this.props;
    return (
      inventoryItems.filter((inventoryItem) => inventoryItem.name === item.name)
        .length > 0
    );
  }

  render() {
    const { inventoryItems, selectedDish } = this.props;
    const { newDate } = this.state;

    return (
      <StyledDishDetails>
        <Items>
          <h4>Items</h4>
          <ul>
            {selectedDish.itemSets.map((itemSet) => (
              <li key={itemSet.id}>
                {itemSet.items.map((item, index) => (
                  <Item
                    key={item.id}
                    color={this.isInInventory(item) ? '' : '#a0a0a0'}
                  >
                    {`${item.name} ${index === itemSet.items.length - 1 ? '' : '/'}`}
                  </Item>
                ))}{' '}
                {itemSet.optional && <span>(optional)</span>}
              </li>
            ))}
          </ul>
        </Items>

        <History>
          <h4>History</h4>
          <form>
            <input type="text" value={newDate} onChange={this.handleDateChange} />
            <button type="submit" onClick={this.addDate}>
              Add
            </button>
          </form>
          <ul>
            {selectedDish.history.map((date) => (
              <React.Fragment key={date.id}>
                <li>
                  <span>{moment(date.date).format('M/D/YY')}</span>
                  <button
                    type="button"
                    onClick={() => this.props.deleteHistoryDate(date.id)}
                  >
                    X
                  </button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </History>
      </StyledDishDetails>
    );
  }
}

const StyledDishDetails = styled.div`
  grid-column: 1 / 5;
  display: grid;
  grid-template-columns: 5fr 7fr;
  padding: 0 30px 25px;
`;

const Items = styled.div`
  font-size: 14px;
`;

const Item = styled.span`
  color: ${(props) => props.color};
`;

const History = styled.div`
  font-size: 14px;

  input[type='text'] {
    width: 50px;
    height: 10px;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    margin-right: 10px;
  }
`;

export default DishDetails;
