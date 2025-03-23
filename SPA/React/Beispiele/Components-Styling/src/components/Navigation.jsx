import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #f8f9fa;
  padding: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const NavItem = styled.li`
  a {
    color: #007bff;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #007bff;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: #007bff;
      color: white;
    }
  }
`;

function Navigation() {
    return (
        <Nav>
            <NavList>
                <NavItem><Link to="/css">CSS</Link></NavItem>
                <NavItem><Link to="/modules">CSS Modules</Link></NavItem>
                <NavItem><Link to="/styled">Styled Components</Link></NavItem>
                <NavItem><Link to="/inline">Inline Styling</Link></NavItem>
            </NavList>
        </Nav>
    );
}

export default Navigation; 