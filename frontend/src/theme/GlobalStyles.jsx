import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.font.sans};
  }
`;

export default GlobalStyles;
