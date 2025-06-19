import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Банковский онлайн-калькулятор</h1>
        <p className="lead">
          Рассчитайте свои финансовые возможности с помощью наших удобных калькуляторов
        </p>
      </div>

      <div className="calculators-grid">
        <div className="calculator-card">
          <h3>Ипотечный калькулятор</h3>
          <p>Рассчитайте ежемесячный платеж и сумму ипотеки с учетом процентной ставки 9.6% годовых.</p>
          <Link to="/calculators/mortgage" className="btn btn-primary">
            Рассчитать ипотеку
          </Link>
        </div>

        <div className="calculator-card">
          <h3>Автокредит</h3>
          <p>Планируете покупку автомобиля? Рассчитайте кредит с выгодной ставкой 3.5% годовых.</p>
          <Link to="/calculators/car-loan" className="btn btn-primary">
            Рассчитать автокредит
          </Link>
        </div>

        <div className="calculator-card">
          <h3>Потребительский кредит</h3>
          <p>Нужны деньги на личные цели? Рассчитайте потребительский кредит со ставкой 14.5% годовых.</p>
          <Link to="/calculators/consumer-loan" className="btn btn-primary">
            Рассчитать потреб. кредит
          </Link>
        </div>

        <div className="calculator-card">
          <h3>Пенсионные накопления</h3>
          <p>Позаботьтесь о своем будущем уже сейчас. Рассчитайте свои пенсионные накопления.</p>
          <Link to="/calculators/pension" className="btn btn-primary">
            Рассчитать накопления
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Преимущества наших калькуляторов</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>Точные расчеты</h4>
            <p>Наши калькуляторы используют актуальные процентные ставки и формулы расчета.</p>
          </div>
          <div className="feature">
            <h4>Удобный интерфейс</h4>
            <p>Интуитивно понятный интерфейс позволяет быстро получить результат.</p>
          </div>
          <div className="feature">
            <h4>Отправка на почту</h4>
            <p>Сохраните результаты расчетов, отправив их на электронную почту.</p>
          </div>
          <div className="feature">
            <h4>Доступ с любого устройства</h4>
            <p>Адаптивный дизайн позволяет пользоваться сервисом с любого устройства.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
