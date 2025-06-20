import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #fff;
  color: #000;
  padding: 20px 0;
  box-shadow: none;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
  }
`;

const Logo = styled.div`
  a {
    text-decoration: none;
  }
  h1 {
    font-size: 2.5rem;
    color: #000;
    text-transform: uppercase;
    margin: 0;
  }
`;

const Navbar = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ul {
    display: flex;
    margin-right: 1rem;
    list-style: none;
  }

  li {
    margin-left: 1.5rem;
    position: relative;
  }
`;

const NavLink = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 15px;
  text-transform: lowercase;
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    font-size: 1.8rem;
  }
`;

const MobileNav = styled.div`
  display: none;
  flex-direction: column;
  background-color: white;
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &.open {
    display: flex;
  }

  a, span {
    padding: 1rem;
    text-align: center;
    width: 100%;
    color: #000;
    text-decoration: none;
  }

  .dropdown-content {
    a {
      padding: 0.5rem 1rem;
    }
  }
`;

const Dropdown = styled.div`
  position: relative;
  align-self: center;
  
  &:hover .dropdown-content {
    display: block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 200px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
    border-radius: 4px;

    a {
      color: #333;
      padding: 0.75rem 1rem;
      display: block;
      text-transform: none;

      &:hover {
        background-color: #e2e8f0;
        text-decoration: none;
      }
    }
  }
`;

const NavSpan = styled.span`
  color: #000;
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 15px;
  text-transform: lowercase;
`;

const AuthNav = styled.div`
  a, span {
    background-color: #B374FF;
    color: #fff !important;
    border-radius: 20px;
    padding: 10px 25px;
    text-decoration: none;
    text-transform: lowercase;
    cursor: pointer;
    white-space: nowrap;
  }
  ul {
      list-style: none;
      display: flex;
      align-items: center;
  }
`;


const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const authLinks = (
    <>
      {user && (
        <li>
          <span>Привет, {user.name}</span>
        </li>
      )}
      {isAdmin && (
        <li>
          <NavLink to="/admin">Админ-панель</NavLink>
        </li>
      )}
      <li>
        <NavSpan onClick={logout}>
          Выйти
        </NavSpan>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <NavLink to="/register">Регистрация</NavLink>
      </li>
      <li>
        <NavLink to="/login">Вход</NavLink>
      </li>
    </>
  );

  return (
    <HeaderContainer>
      <div className="container">
        <Logo>
          <Link to="/">
            <h1>BANK</h1>
          </Link>
        </Logo>
        <Navbar>
          <ul>
            <li>
              <NavLink to="/">Главная</NavLink>
            </li>
            <li className="dropdown-li">
              <Dropdown>
                <NavSpan>Калькуляторы</NavSpan>
                <div className="dropdown-content">
                  <NavLink to="/calculators/mortgage">Ипотека</NavLink>
                  <NavLink to="/calculators/car-loan">Автокредит</NavLink>
                  <NavLink to="/calculators/consumer-loan">Потребительский кредит</NavLink>
                  <NavLink to="/calculators/pension">Пенсионные накопления</NavLink>
                </div>
              </Dropdown>
            </li>
          </ul>
          <AuthNav>
            <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
          </AuthNav>
        </Navbar>
        <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </MobileMenuIcon>
        <MobileNav className={menuOpen ? 'open' : ''}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Главная</NavLink>
          <Dropdown>
            <NavSpan>Калькуляторы</NavSpan>
            <div className="dropdown-content">
              <NavLink to="/calculators/mortgage" onClick={() => setMenuOpen(false)}>Ипотека</NavLink>
              <NavLink to="/calculators/car-loan" onClick={() => setMenuOpen(false)}>Автокредит</NavLink>
              <NavLink to="/calculators/consumer-loan" onClick={() => setMenuOpen(false)}>Потребительский кредит</NavLink>
              <NavLink to="/calculators/pension" onClick={() => setMenuOpen(false)}>Пенсионные накопления</NavLink>
            </div>
          </Dropdown>
          {isAuthenticated ? 
            <>
              {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Админ-панель</NavLink>}
              <NavSpan onClick={() => { logout(); setMenuOpen(false); }}>Выйти</NavSpan>
            </>
             : 
            <>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>Регистрация</NavLink>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Вход</NavLink>
            </>
          }
        </MobileNav>
      </div>
    </HeaderContainer>
  );
};

export default Header; 