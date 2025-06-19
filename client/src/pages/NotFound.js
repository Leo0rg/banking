import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className="btn btn-primary">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
