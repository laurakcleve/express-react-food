import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    @import url( 'https://fonts.googleapis.com/css?family=Heebo');
    font-family: 'Heebo';
    margin: 0;
    padding: 0;
    background-color: #f7f6f5;
  }

  button {
    font-family: 'Heebo';
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 3px 10px;
    &:focus {
      outline: none;
    }
  }

  input[type="text"] {
  width: 250px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #505050;
  font-size: 14px;
    &:focus {
      outline: none;
    }
  }
`;

export default GlobalStyles;
