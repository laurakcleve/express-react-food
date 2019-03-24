import React from 'react';

const TagInput = ({ tags, dishTags, handleTagChange, removeTag, addTag }) => (
  <div>
    {tags.map((tag, index) => (
      <React.Fragment>
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

        <button onClick={removeTag} data-index={index}>
          &mdash;
        </button>
      </React.Fragment>
    ))}

    <button onClick={addTag}> +</button>
  </div>
);

export default TagInput;
