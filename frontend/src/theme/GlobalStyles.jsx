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
    &:focus {
      outline: none;
    }
  }

  input {
    &:focus {
      outline: none;
    }
  }
`;

export default GlobalStyles;
