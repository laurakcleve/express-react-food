import React from 'react';
import uniqid from 'uniqid';
import styled from 'styled-components';

const TagInput = ({ tags, dishTags, handleTagChange, removeTag, addTag }) => (
  <div>
    {tags.map((tag, index) => (
      <Tag>
        <input
          type="text"
          name={`tag${index}`}
          value={tag}
          data-index={index}
          onChange={handleTagChange}
          list={`tag${index}List`}
        />

        <datalist id={`tag${index}List`}>
          {dishTags.map((dishTag) => (
            <option key={dishTag.id}>{dishTag.name}</option>
          ))}
        </datalist>

        <RemoveButton onClick={removeTag} data-index={index}>
          &mdash;
        </RemoveButton>
      </Tag>
    ))}

    <AddButton className="add" onClick={addTag}>
      {' '}
      +
    </AddButton>
  </div>
);

const Tag = styled.div`
  display: block;

  input {
    width: 200px;
    margin: 3px 3px 3px 0;
  }
`;

const AddButton = styled.button`
  display: block;
  margin-top: 10px;
`;

const RemoveButton = styled.button``;

export default TagInput;
