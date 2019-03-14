import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import Header from './components/Header';
import Inventory from './components/Inventory/Inventory';
import Dishes from './components/Dishes';

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyles />
        <Header />
        <Route path="(/|/inventory)" component={Inventory} />
        <Route exact path="/dishes" component={Dishes} />
      </React.Fragment>
    </ThemeProvider>
  </Router>
);

export default App;
