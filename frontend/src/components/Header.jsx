import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => (
  <StyledHeader>
    <Link to="/inventory">Inventory</Link>
    <Link to="/dishes">Dishes</Link>
  </StyledHeader>
);

const StyledHeader = styled.header`
  a {
    display: inline-block;
    padding: 1rem;
    margin-right: 1rem;
  }
`;

export default Header;
