import React, { Component } from 'react';
import moment from 'moment';

class DishDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { newDate: moment(Date.now()).format('M/D/YY') };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.addDate = this.addDate.bind(this);
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

  render() {
    const { selectedDish } = this.props;
    const { newDate } = this.state;

    return (
      <div>
        <h4>Items</h4>
        <ul>
          {selectedDish.itemSets.map((itemSet) => (
            <li key={itemSet.id}>
              {itemSet.items.map((item) => (
                <span key={item.id}>{`${item.name}/`}</span>
              ))}{' '}
              {itemSet.optional && <span>(optional)</span>}
            </li>
          ))}
        </ul>

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
              <li>{moment(date.date).format('M/D/YY')}</li>
              <button type="button" onClick={() => this.props.deleteHistoryDate(date.id)}>
                X
              </button>
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}

export default DishDetails;
