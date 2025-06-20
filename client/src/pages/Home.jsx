import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/axios';

const HomePage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #000;
`;

const HeroSection = styled.section`
  text-align: center;
  margin: 60px 0;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.div`
  background-color: #A3FF32;
  border-radius: 2em;
  padding: 20px;
  display: inline-block;
  margin-top: 20px;
  p {
    font-size: 1.2rem;
    margin: 0;
    color: white;
  }

  @media (max-width: 768px) {
    p {
      font-size: 1rem;
    }
  }
`;

const CalculatorCardsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin: 60px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CalculatorCard = styled.div`
  border: 2px solid #000;
  border-radius: 3em;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  background-color: #B374FF;
  color: #fff;
  padding: 20px;
  text-align: center;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CardBody = styled.div`
  background-color: #fff;
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  p {
    font-size: 1rem;
    min-height: 60px;
  }
`;

const CalculateButton = styled(Link)`
  background-color: #A3FF32;
  color: white;
  width: 60%;
  align-self: end;
  border-radius: 3em;
  padding: 15px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  display: inline-block;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
  }
`;

const AdvantagesSection = styled.section`
  // border: 2px solid #000;
  // border-radius: 20px;
  overflow: hidden;
  margin: 60px 0;
`;

const AdvantagesHeader = styled.div`
  background-color: #B374FF;
  color: #fff;
  padding: 25px;
  text-align: center;
  border-radius: 3em 3em 0 0;
  min-height: 150px;
  z-index: 5;
  margin-bottom: -3.5em;
  h2 {
    margin: 0;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    padding: 3em 1em;
    margin-bottom: -2.5em;
  }
`;

const AdvantagesBody = styled.div`
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 3em;
  z-index: 4;
  padding: 40px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  li {
    font-size: 1.2rem;
    position: relative;
    padding-left: 20px;
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #000;
    }
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const Home = () => {
  const [calculators, setCalculators] = useState([]);

  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const res = await api.get('/api/calculators');
        setCalculators(res.data);
      } catch (err) {
        console.error('Error fetching calculators:', err);
      }
    };
    fetchCalculators();
  }, []);

  const calculatorRoutes = {
    mortgage: '/calculators/mortgage',
    carLoan: '/calculators/car-loan',
    consumerLoan: '/calculators/consumer-loan',
    pension: '/calculators/pension',
  };

  return (
    <HomePage>
      <HeroSection>
        <HeroTitle>Банковский онлайн-калькулятор</HeroTitle>
        <HeroSubtitle>
          <p>рассчитайте свои финансовые возможности с помощью наших удобных калькуляторов</p>
        </HeroSubtitle>
      </HeroSection>

      <CalculatorCardsSection>
        {calculators.map((calc) => (
          <CalculatorCard key={calc._id}>
            <CardHeader>
              <h3>{calc.name}</h3>
            </CardHeader>
            <CardBody>
              <p>{calc.description}</p>
              <CalculateButton to={calculatorRoutes[calc.type]}>
                рассчитать {calc.type === 'mortgage' ? 'ипотеку' : calc.type === 'carLoan' ? 'автокредит' : calc.type === 'consumerLoan' ? 'потреб.кредит' : 'накопления'}
              </CalculateButton>
            </CardBody>
          </CalculatorCard>
        ))}
      </CalculatorCardsSection>

      <AdvantagesSection>
        <AdvantagesHeader>
          <h2>Преимущества наших калькуляторов</h2>
        </AdvantagesHeader>
        <AdvantagesBody>
          <ul>
            <li>Точные расчеты</li>
            <li>Отправка на почту</li>
            <li>Удобный интерфейс</li>
            <li>Доступ с любого устройства</li>
          </ul>
        </AdvantagesBody>
      </AdvantagesSection>
    </HomePage>
  );
};

export default Home;
