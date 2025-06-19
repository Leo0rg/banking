import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Банк-Калькулятор. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer; 