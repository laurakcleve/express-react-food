/* globals fetch */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import TagInput from './TagInput';
import ItemSet from './ItemSet';

class DishForm extends Component {
  constructor(props) {
    super(props);

    const { existingName, existingTags, existingItemSets } = this.props;

    this.state = {
      name: existingName,
      tags: [...existingTags],
      itemSets: existingItemSets.map((itemSet) => ({
        id: itemSet.id,
        optional: itemSet.optional,
        items: itemSet.items.map((item) => ({ id: item.id, name: item.name })),
      })),
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
    this.resetForm = this.resetForm.bind(this);
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
  //  ADD TAG
  //----------------------------------------------------------------------------------
  addTag(event) {
    event.preventDefault();
    const { tags } = this.state;
    tags.push('');
    this.setState({ tags });
  }

  //
  //  REMOVE TAG
  //----------------------------------------------------------------------------------
  removeTag(event) {
    event.preventDefault();
    const { tags } = this.state;
    const { index } = event.target.dataset;
    tags.splice(index, 1);
    this.setState({ tags });
  }

  //
  //  HANDLE TAG CHANGE
  //----------------------------------------------------------------------------------
  handleTagChange(event) {
    const { value } = event.target;
    const { index } = event.target.dataset;
    const { tags } = this.state;
    tags[index] = value;
    this.setState({ tags });
  }

  //
  //  ADD ITEM SET
  //----------------------------------------------------------------------------------
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

  //
  //  ADD ITEM SET ITEM
  //----------------------------------------------------------------------------------
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

  //
  //  HANDLE ITEM NAME CHANGE
  //----------------------------------------------------------------------------------
  handleItemNameChange(event) {
    const { value } = event.target;
    const { itemSetIndex, itemSetItemIndex } = event.target.dataset;
    const { itemSets } = this.state;

    itemSets[itemSetIndex].items[itemSetItemIndex].name = value;

    this.setState({ itemSets });
  }

  //
  //  HANDLE ITEM OPTIONAL CHANGE
  //----------------------------------------------------------------------------------
  handleItemOptionalChange(event) {
    const { itemSetIndex } = event.target.dataset;
    const { itemSets } = this.state;

    itemSets[itemSetIndex].optional = !itemSets[itemSetIndex].optional;

    this.setState({ itemSets });
  }

  //
  //  HANDLE REMOVE ITEM SUBSTITUTE
  //----------------------------------------------------------------------------------
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

  //
  //  HANDLE CANCEL
  //----------------------------------------------------------------------------------
  handleCancel(event) {
    event.preventDefault();
    this.setState = { name: '', tags: [], itemSets: [] };
    this.props.cancel();
  }

  //
  //  HANDLE SAVE
  //----------------------------------------------------------------------------------
  handleSave(event) {
    event.preventDefault();
    // this.props.save(this.state);
    // this.setState = { name: '', tags: [], itemSets: [] };

    const { items, dishTags, editDishID, apiPath, fetchData } = this.props;
    const saveData = this.state;
    saveData.items = items;
    saveData.dishTags = dishTags;
    saveData.editDishID = editDishID;

    console.log('saveData', saveData);

    fetch(apiPath, {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        fetchData();
        this.resetForm();
      }
    });
  }

  //
  //  RESET FORM
  //----------------------------------------------------------------------------------
  resetForm() {
    this.setState({ name: '', tags: [], itemSets: [] });
  }

  //
  //  RENDER
  //----------------------------------------------------------------------------------
  render() {
    const { name, tags, itemSets } = this.state;
    const { items, dishTags } = this.props;
    return (
      <StyledDishForm>
        <Name>
          <label htmlFor="name">
            <h4>Name</h4>
            <input
              type="text"
              className="name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </label>
        </Name>

        <Tags>
          <h4>Tags</h4>
          <TagInput
            tags={tags}
            dishTags={dishTags}
            handleTagChange={this.handleTagChange}
            removeTag={this.removeTag}
            addTag={this.addTag}
          />
        </Tags>

        <Items>
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
        </Items>

        <CancelOrSave>
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={this.handleSave}>Save</button>
        </CancelOrSave>
      </StyledDishForm>
    );
  }
}

const StyledDishForm = styled.form`
  display: grid;
  grid-template-columns:
    300px auto
    h4 {
    margin-bottom: 5px;
  }
`;

const Name = styled.div`
  display: inline-block;
`;

const Tags = styled.div`
  display: inline-block;
  margin-left: 50px;
`;

const Items = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  margin-bottom: 30px;
`;

const CancelOrSave = styled.div``;

DishForm.defaultProps = {
  existingName: '',
  existingTags: [],
  existingItemSets: [],
};

DishForm.propTypes = {
  existingName: PropTypes.string,
  existingTags: PropTypes.arrayOf(PropTypes.string),
  existingItemSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      optional: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    })
  ),

  cancel: PropTypes.func.isRequired,

  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category_id: PropTypes.number,
      default_location_id: PropTypes.number,
      default_shelflife: PropTypes.number,
    })
  ).isRequired,
  dishTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DishForm;
