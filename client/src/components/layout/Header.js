import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);

  const authLinks = (
    <ul>
      {user && (
        <li>
          <span>Привет, {user.name}</span>
        </li>
      )}
      {isAdmin && (
        <li>
          <Link to="/admin">Админ-панель</Link>
        </li>
      )}
      <li>
        <a onClick={logout} href="#!">
          Выйти
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Регистрация</Link>
      </li>
      <li>
        <Link to="/login">Вход</Link>
      </li>
    </ul>
  );

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>Банк-Калькулятор</h1>
          </Link>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li className="dropdown">
              <span>Калькуляторы</span>
              <div className="dropdown-content">
                <Link to="/calculators/mortgage">Ипотека</Link>
                <Link to="/calculators/car-loan">Автокредит</Link>
                <Link to="/calculators/consumer-loan">Потребительский кредит</Link>
                <Link to="/calculators/pension">Пенсионные накопления</Link>
              </div>
            </li>
          </ul>
          <div className="auth-nav">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 