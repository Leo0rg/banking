import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
`;

const PageTitle = styled.h2`
  background-color: #A3FF32;
  color: #000;
  font-size: 2.5rem;
  padding: 15px 30px;
  border-radius: 3em;
  display: inline-block;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 10px 20px;
  }
`;

const FormContainer = styled.div`
  border: 2px solid #000;
  border-radius: 3em;
  padding: 2rem 3rem;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2.5rem;
  label {
    display: block;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const InputWrapper = styled.div`
  border: 2px solid #000;
  border-radius: 2em 2em 3em 3em;
  padding: 10px 20px;
  input[type="number"] {
    border: none;
    outline: none;
    width: 100%;
    font-family: 'Dela Gothic One', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 10px;
    background: none;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 5px;
    background: transparent;
    margin-top: 10px;

    &::-webkit-slider-runnable-track {
      height: 2px;
      background: linear-gradient(to right, #A3FF32 var(--value-percent, 0%), #000 var(--value-percent, 0%));
    }

    &::-moz-range-track {
      height: 2px;
      background: linear-gradient(to right, #A3FF32 var(--value-percent, 0%), #000 var(--value-percent, 0%));
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #A3FF32;
      border: 2px solid #000;
      border-radius: 50%;
      margin-top: -9px;
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #A3FF32;
      border: 2px solid #000;
      border-radius: 50%;
    }
  }
`;

const SubmitButton = styled.button`
  background-color: #B374FF;
  color: #fff;
  border: none;
  border-radius: 3em;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-family: 'Dela Gothic One', sans-serif;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: 0;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const ResultsContainer = styled.div`
  border: 2px solid #000;
  border-radius: 3em;
  padding: 2rem;
  margin-top: 2rem;
  h3 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    h3 {
      font-size: 1.5rem;
    }
  }
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
  span:last-child {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;

    span:first-child {
      margin-bottom: 0.5rem;
    }
  }
`;

const EmailContainer = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const EmailForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const EmailInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-family: 'Dela Gothic One', sans-serif;
  border: 2px solid #000;
  border-radius: 3em;
  background: none;
`;

const EmailButton = styled(SubmitButton)`
  margin: 0;
`;

const AuthPrompt = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  a {
    color: #B374FF;
    font-weight: bold;
  }
`;

const formatCurrency = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const ConsumerLoanCalculator = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    loanAmount: 500000,
    term: 3,
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  
  const loanAmountRef = useRef(null);
  const termRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const updateSliderStyle = (ref, value) => {
      if (ref.current) {
        const min = Number(ref.current.min);
        const max = Number(ref.current.max);
        const percent = ((value - min) / (max - min)) * 100;
        ref.current.style.setProperty('--value-percent', `${percent}%`);
      }
    };
    updateSliderStyle(loanAmountRef, formData.loanAmount);
    updateSliderStyle(termRef, formData.term);
  }, [formData]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/calculators/calculate/consumerLoan', formData);
      setCalculationResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Произошла ошибка');
    }
    setLoading(false);
  };

  const sendResultsToEmail = async e => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);
    setEmailSent(false);
    
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
      setEmailLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Потребительский кредит</PageTitle>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="loanAmount">Сумма кредита</label>
            <InputWrapper>
              <input
                type="number"
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                min="50000"
                max="3000000"
              />
              <input
                ref={loanAmountRef}
                type="range"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                min="50000"
                max="3000000"
                step="10000"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label htmlFor="term">Срок кредита (лет)</label>
            <InputWrapper>
              <input
                type="number"
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                min="1"
                max="5"
              />
              <input
                ref={termRef}
                type="range"
                name="term"
                value={formData.term}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </InputWrapper>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Расчет...' : 'Рассчитать'}
          </SubmitButton>
        </form>
      </FormContainer>

      {error && <p style={{color: 'red', textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
      
      {calculationResult && (
        <ResultsContainer>
          <h3>Результаты расчета</h3>
          <ResultItem>
            <span>Сумма кредита</span>
            <span>{formatCurrency(calculationResult.loanAmount)}</span>
          </ResultItem>
          <ResultItem>
            <span>Ежемесячный платеж</span>
            <span>{formatCurrency(calculationResult.monthlyPayment)}</span>
          </ResultItem>
          <ResultItem>
            <span>Необходимый доход</span>
            <span>{formatCurrency(calculationResult.requiredIncome)}</span>
          </ResultItem>
          <ResultItem>
            <span>Общая выплата</span>
            <span>{formatCurrency(calculationResult.totalPayment)}</span>
          </ResultItem>
          <ResultItem>
            <span>Процентная ставка</span>
            <span>{calculationResult.interestRate}%</span>
          </ResultItem>

          <EmailContainer>
            {isAuthenticated ? (
              <EmailForm onSubmit={sendResultsToEmail}>
                <EmailInput 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  required 
                />
                <EmailButton type="submit" disabled={emailLoading}>
                  {emailLoading ? 'Отправка...' : 'Отправить на почту'}
                </EmailButton>
              </EmailForm>
            ) : (
              <div>
                <EmailButton type="button" disabled>
                  Отправить на почту
                </EmailButton>
                <AuthPrompt>
                  <Link to="/login">Войдите</Link> или <Link to="/register">зарегистрируйтесь</Link>, чтобы отправить результаты.
                </AuthPrompt>
              </div>
            )}
            {emailSent && <p style={{color: 'green', marginTop: '1rem'}}>Результаты успешно отправлены!</p>}
            {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
          </EmailContainer>

        </ResultsContainer>
      )}
    </PageContainer>
  );
};

export default ConsumerLoanCalculator;
