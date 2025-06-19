import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const PensionCalculator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    initialDeposit: 100000,
    monthlyContribution: 5000,
    term: 20,
    currentAge: 30,
    retirementAge: 65
  });
  
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  
  const { initialDeposit, monthlyContribution, term, currentAge, retirementAge } = formData;
  
  // Обработка изменений в форме
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Расчет пенсионных накоплений
  const calculatePension = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/calculators/calculate/pension', formData);
      setCalculationResult({
        ...formData,
        ...res.data
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Ошибка при расчете пенсионных накоплений');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Отправка результатов на почту
  const sendResultsToEmail = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/api/calculators/email', {
        email,
        subject: 'Результаты расчета пенсионных накоплений',
        calculationType: 'пенсионные накопления',
        calculationResults: calculationResult
      });
      setEmailSent(true);
    } catch (err) {
      setError('Ошибка при отправке результатов на почту');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Форматирование числа в рубли
  const formatCurrency = value => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="calculator">
      <h2 className="calculator-title">Калькулятор пенсионных накоплений</h2>
      
      <div className="calculator-form">
        <form onSubmit={calculatePension}>
          <div className="form-group">
            <label className="form-label">Первоначальный взнос</label>
            <input
              type="number"
              name="initialDeposit"
              value={initialDeposit}
              onChange={handleChange}
              className="form-control"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Ежемесячный взнос</label>
            <input
              type="number"
              name="monthlyContribution"
              value={monthlyContribution}
              onChange={handleChange}
              className="form-control"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Срок накопления (лет)</label>
            <input
              type="number"
              name="term"
              value={term}
              onChange={handleChange}
              className="form-control"
              min="1"
              max="40"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Текущий возраст</label>
            <input
              type="number"
              name="currentAge"
              value={currentAge}
              onChange={handleChange}
              className="form-control"
              min="18"
              max="80"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Возраст выхода на пенсию</label>
            <input
              type="number"
              name="retirementAge"
              value={retirementAge}
              onChange={handleChange}
              className="form-control"
              min={currentAge}
              max="100"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Расчет...' : 'Рассчитать'}
          </button>
        </form>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {calculationResult && (
        <div className="calculator-result">
          <h3>Результаты расчета</h3>
          
          <div className="result-item">
            <span>Первоначальный взнос:</span>
            <span>{formatCurrency(calculationResult.initialDeposit)}</span>
          </div>
          
          <div className="result-item">
            <span>Ежемесячный взнос:</span>
            <span>{formatCurrency(calculationResult.monthlyContribution)}</span>
          </div>
          
          <div className="result-item">
            <span>Срок накопления:</span>
            <span>{calculationResult.term} лет</span>
          </div>
          
          <div className="result-item">
            <span>Общая сумма взносов:</span>
            <span>{formatCurrency(calculationResult.totalContributions)}</span>
          </div>
          
          <div className="result-item">
            <span>Общая сумма накоплений:</span>
            <span>{formatCurrency(calculationResult.totalSavings)}</span>
          </div>
          
          <div className="result-item">
            <span>Ежемесячная пенсионная выплата:</span>
            <span>{formatCurrency(calculationResult.monthlyPension)}</span>
          </div>
          
          <div className="result-item">
            <span>Возраст выхода на пенсию:</span>
            <span>{calculationResult.retirementAge} лет</span>
          </div>
          
          <div className="result-item">
            <span>Процентная ставка:</span>
            <span>{calculationResult.interestRate}% годовых</span>
          </div>
          
          {isAuthenticated && (
            <div className="email-form">
              <h4>Отправить результаты на почту</h4>
              {emailSent ? (
                <div className="alert alert-success">Результаты успешно отправлены на почту</div>
              ) : (
                <form onSubmit={sendResultsToEmail}>
                  <div className="form-group">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Введите email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить на почту'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PensionCalculator;
