import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: 2rem;

  p {
    margin: 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} Банк-Калькулятор. Все права защищены.</p>
    </FooterContainer>
  );
};

export default Footer; 