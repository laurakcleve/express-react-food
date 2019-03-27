import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';

import EditDish from './EditDish';
import DishDetails from './DishDetails';

const DishList = ({
  dishes,
  items,
  dishTags,
  editDishID,
  editDishName,
  editDishTags,
  editDishItemSets,
  showDishItems,
  editDish,
  cancelEditDish,
  saveEditDish,
  handleSort,
  fetchData,
  selectedDish,
  saveHistoryDate,
  deleteHistoryDate,
}) => (
  <StyledDishList>
    <ul>
      <li>
        <HeaderButton onClick={handleSort} data-category="name">
          Name
        </HeaderButton>
        <HeaderButton onClick={handleSort} data-category="lastDate">
          Last Date
        </HeaderButton>
      </li>
      {dishes.map((dish) => (
        <DishListItem key={dish.id}>
          <button className="dish-name" data-id={dish.id} onClick={showDishItems}>
            {dish.name}
          </button>

          <LastDate>
            {dish.lastDate ? moment(dish.lastDate.date).format('M/D') : null}
          </LastDate>

          <TagList>
            {dish.tags.map((tag, index) => (
              <span key={tag.id}>
                {tag.name}
                {index < dish.tags.length - 1 ? `, ` : ``}
              </span>
            ))}
          </TagList>

          <button
            className="edit"
            onClick={editDish}
            data-id={dish.id}
            data-name={dish.name}
          >
            Edit
          </button>

          {editDishID === dish.id && (
            <EditDish
              items={items}
              dishTags={dishTags}
              editDishID={editDishID}
              editDishName={editDishName}
              editDishTags={editDishTags}
              editDishItemSets={editDishItemSets}
              cancelEditDish={cancelEditDish}
              saveEditDish={saveEditDish}
              fetchData={fetchData}
            />
          )}

          {selectedDish && selectedDish.id === dish.id && (
            <DishDetails
              selectedDish={selectedDish}
              saveHistoryDate={saveHistoryDate}
              deleteHistoryDate={deleteHistoryDate}
            />
          )}
        </DishListItem>
      ))}
    </ul>
  </StyledDishList>
);

const StyledDishList = styled.div`
  ul {
    list-style-type: none;
    padding: 0;

    li {
    }
  }

  .dish-name {
    padding: 10px;
    background-color: transparent;
    border: none;
    text-align: left;
  }

  button.edit {
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 27px;
    width: 48px;
    margin-top: 8px;
    margin-right: 5px;
  }
`;

const HeaderButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: left;
  font-weight: bold;
  font-size: 12px;
  padding: 5px 10px;
`;

const LastDate = styled.div`
  padding: 5px 10px;
  font-size: 12px;
`;

const TagList = styled.div`
  margin: 10px;
  height: 19px;
  font-size: 12px;
  overflow: hidden;
`;

const DishListItem = styled.li`
  display: grid;
  grid-template-columns: 5fr 3fr 3fr 1fr;
  border: 1px solid #eaeaea;

  &:nth-child(even) {
    background-color: #f1f1f1;
  }
`;

DishList.defaultProps = {
  editDishID: null,
  editDishName: '',
  editDishTags: [],
  editDishItemSets: [],
};

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      lastDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ]),
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
      itemSets: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          optional: PropTypes.bool,
          items: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              amount_num: PropTypes.number,
              amount_unit: PropTypes.string,
            })
          ),
        })
      ),
      history: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,

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

  editDishID: PropTypes.number,
  editDishName: PropTypes.string,
  editDishTags: PropTypes.arrayOf(PropTypes.string),
  editDishItemSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      optional: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    })
  ),

  showDishItems: PropTypes.func.isRequired,
  editDish: PropTypes.func.isRequired,
  cancelEditDish: PropTypes.func.isRequired,
  saveEditDish: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
};

export default DishList;
