import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const ConsumerLoanCalculator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    loanAmount: 300000,
    term: 3
  });
  
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  
  const { loanAmount, term } = formData;
  
  // Обработка изменений в форме
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Расчет потребительского кредита
  const calculateConsumerLoan = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/calculators/calculate/consumerLoan', formData);
      setCalculationResult(res.data);
    } catch (err) {
      setError('Ошибка при расчете потребительского кредита');
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
        subject: 'Результаты расчета потребительского кредита',
        calculationType: 'потребительский кредит',
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
      <h2 className="calculator-title">Калькулятор потребительского кредита</h2>
      
      <div className="calculator-form">
        <form onSubmit={calculateConsumerLoan}>
          <div className="form-group">
            <label className="form-label">Сумма кредита</label>
            <input
              type="number"
              name="loanAmount"
              value={loanAmount}
              onChange={handleChange}
              className="form-control"
              min="50000"
              max="3000000"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Срок кредита (лет)</label>
            <input
              type="number"
              name="term"
              value={term}
              onChange={handleChange}
              className="form-control"
              min="1"
              max="7"
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
            <span>Сумма кредита:</span>
            <span>{formatCurrency(calculationResult.loanAmount)}</span>
          </div>
          
          <div className="result-item">
            <span>Ежемесячный платеж:</span>
            <span>{formatCurrency(calculationResult.monthlyPayment)}</span>
          </div>
          
          <div className="result-item">
            <span>Общая сумма выплат:</span>
            <span>{formatCurrency(calculationResult.totalPayment)}</span>
          </div>
          
          <div className="result-item">
            <span>Необходимый доход:</span>
            <span>{formatCurrency(calculationResult.requiredIncome)}</span>
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

export default ConsumerLoanCalculator;
