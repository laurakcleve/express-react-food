import React, { Component } from 'react';
import styled from 'styled-components';

import ItemSet from './ItemSet';

class DishForm extends Component {
  constructor(props) {
    super(props);

    const { existingName, existingTags, existingItemSets } = this.props;

    this.state = {
      name: existingName || '',
      tags: existingTags || [],
      itemSets: existingItemSets || [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.addItemSet = this.addItemSet.bind(this);
    this.addItemSetItem = this.addItemSetItem.bind(this);
    this.handleItemNameChange = this.handleItemNameChange.bind(this);
    this.handleItemOptionalChange = this.handleItemOptionalChange.bind(this);
    this.handleRemoveItemSubstitute = this.handleRemoveItemSubstitute.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(event) {
    const { value, name, type } = event.target;
    const val = type === 'number' ? parseFloat(value) || '' : value;
    this.setState({ [name]: val });
  }

  addTag(event) {
    event.preventDefault();
    const { tags } = this.state;
    tags.push('');
    this.setState({ tags });
  }

  removeTag(event) {
    event.preventDefault();
    const { tags } = this.state;
    const { index } = event.target.dataset;
    tags.splice(index, 1);
    this.setState({ tags });
  }

  handleTagChange(event) {
    const { value } = event.target;
    const { index } = event.target.dataset;
    const { tags } = this.state;
    tags[index] = value;
    this.setState({ tags });
  }

  addItemSet(event) {
    event.preventDefault();
    const { itemSets } = this.state;
    itemSets.push({
      id: Date.now(),
      items: [
        {
          id: Date.now(),
          name: '',
        },
      ],
      optional: '',
    });
    this.setState({ itemSets });
  }

  addItemSetItem(event) {
    event.preventDefault();
    const { itemSetIndex } = event.target.dataset;
    const { itemSets } = this.state;

    itemSets[itemSetIndex].items.push({
      id: Date.now(),
      name: '',
    });

    this.setState({ itemSets });
  }

  handleItemNameChange(event) {
    const { value } = event.target;
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { itemSets } = this.state;

    itemSets[itemSetIndex].items[itemSetItemIndex].name = value;

    this.setState({ itemSets });
  }

  handleItemOptionalChange(event) {
    const { itemSetIndex } = event.target.dataset;
    const { itemSets } = this.state;

    itemSets[itemSetIndex].optional = !itemSets[itemSetIndex].optional;

    this.setState({ itemSets });
  }

  handleRemoveItemSubstitute(event) {
    event.preventDefault();
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { itemSets } = this.state;

    if (itemSets[itemSetIndex].items.length === 1) {
      itemSets.splice(itemSetIndex, 1);
    } else {
      itemSets[itemSetIndex].items.splice(itemSetItemIndex, 1);
    }

    this.setState({ itemSets });
  }

  handleCancel(event) {
    event.preventDefault();
    this.setState = { name: '', tags: [], itemSets: [] };
    this.props.cancel();
  }

  handleSave(event) {
    event.preventDefault();
    this.props.save(this.state);
    this.setState = { name: '', tags: [], itemSets: [] };
  }

  render() {
    const { name, tags, itemSets } = this.state;
    const { items, dishTags, existingName } = this.props;
    return (
      <StyledDishForm>
        <label htmlFor="name">
          <h4>Name</h4>
          <input type="text" className="name" name="name" value={name} onChange={this.handleChange} />
        </label>

        <h4>Tags</h4>
        {tags.map((tag, index) => (
          <React.Fragment>
            <input
              type="text"
              name={`tag${index}`}
              value={tag}
              data-index={index}
              onChange={this.handleTagChange}
              list={`tag${index}List`}
            />

            <datalist id={`tag${index}List`}>
              {dishTags.map((dishTag) => (
                <option key={dishTag.id}>{dishTag.name}</option>
              ))}
            </datalist>

            <button onClick={this.removeTag} data-index={index}>
              &mdash;
            </button>
          </React.Fragment>
        ))}
        <button onClick={this.addTag}>+</button>

        <h4>Items</h4>
        {itemSets.map((itemSet, index) => (
          <ItemSet
            key={itemSet.id}
            items={items}
            itemSet={itemSet}
            itemSetIndex={index}
            handleItemNameChange={this.handleItemNameChange}
            handleItemOptionalChange={this.handleItemOptionalChange}
            addItemSetItem={this.addItemSetItem}
            handleRemoveItemSubstitute={this.handleRemoveItemSubstitute}
          />
        ))}
        <button onClick={this.addItemSet}>+</button>

        <br />
        <button onClick={this.handleCancel}>Cancel</button>
        <button onClick={this.handleSave}>Save</button>
      </StyledDishForm>
    );
  }
}

const StyledDishForm = styled.form`
  h4 {
    margin-bottom: 5px;
  }

  input.name {
    display: block;
    width: 250px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #505050;
    font-size: 11px;
    text-transform: uppercase;
  }
`;
export default DishForm;
