import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
    font-family: 'Source Sans Pro';
    margin: 0;
    padding: 0;
    background-color: #f7f6f5;
  }

  button {
    font-family: 'Source Sans Pro';
  }
`;

export default GlobalStyles;
