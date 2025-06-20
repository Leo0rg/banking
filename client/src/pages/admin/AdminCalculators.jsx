import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Button = styled.button`
  font-family: 'Dela Gothic One';
  background-color: ${props => props.danger ? '#dc3545' : (props.secondary ? '#6c757d' : '#007bff')};
  color: white;
  border: none;
  padding: ${props => props.sm ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: ${props => props.sm ? '0.875rem' : '1rem'};
  transition: background-color 0.15s ease-in-out;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    display: block;
    
    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
    }

    td {
      display: block;
      text-align: right;
      padding-left: 50%;
      position: relative;
      border: none;
      padding: 0.5rem 0.75rem;

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0.75rem;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
      }
    }
  }
`;

const StyledLink = styled(Link)`
  background-color: #A3FF32;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 3rem;
  text-decoration: none;

  &:hover {
    background-color: black;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusButton = styled(Button)`
  font-family: 'Dela Gothic One';
  background-color: ${props => props.active ? '#A3FF32' : 'black'};
`;

const EditLink = styled(Link)`
  background-color: #6c757d;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    background-color: #5a6268;
  }
`;

const AdminCalculators = () => {
  const [calculators, setCalculators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка списка калькуляторов
  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const res = await api.get('/api/admin/calculators');
        setCalculators(res.data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке калькуляторов');
        console.error(err);
        setLoading(false);
      }
    };

    fetchCalculators();
  }, []);

  // Удаление калькулятора
  const deleteCalculator = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот калькулятор?')) {
      try {
        await api.delete(`/api/admin/calculators/${id}`);
        setCalculators(calculators.filter(calculator => calculator._id !== id));
      } catch (err) {
        setError('Ошибка при удалении калькулятора');
        console.error(err);
      }
    }
  };

  // Изменение статуса активности калькулятора
  const toggleCalculatorStatus = async (id) => {
    try {
      const calculatorToUpdate = calculators.find(calc => calc._id === id);
      if (!calculatorToUpdate) return;

      const updatedCalculator = { ...calculatorToUpdate, isActive: !calculatorToUpdate.isActive };

      const res = await api.put(`/api/admin/calculators/${id}`, updatedCalculator);
      
      setCalculators(
        calculators.map(calculator => 
          calculator._id === id ? res.data : calculator
        )
      );
    } catch (err) {
      setError('Ошибка при изменении статуса калькулятора');
      console.error(err);
    }
  };

  // Получение названия типа калькулятора на русском
  const getCalculatorTypeName = (type) => {
    const types = {
      mortgage: 'Ипотека',
      carLoan: 'Автокредит',
      consumerLoan: 'Потребительский кредит',
      pension: 'Пенсионные накопления'
    };
    
    return types[type] || type;
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AdminContainer>
      <Header>
        <h2>Управление калькуляторами</h2>
        <StyledLink to="/admin/calculators/new">
          Добавить новый калькулятор
        </StyledLink>
      </Header>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div>
        <Table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Процентная ставка</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {calculators.length === 0 ? (
              <tr>
                <td colSpan="5">Калькуляторы не найдены</td>
              </tr>
            ) : (
              calculators.map(calculator => (
                <tr key={calculator._id}>
                  <td data-label="Название">{calculator.name}</td>
                  <td data-label="Тип">{getCalculatorTypeName(calculator.type)}</td>
                  <td data-label="Процентная ставка">{calculator.interestRate}%</td>
                  <td data-label="Статус">
                    <StatusButton
                      sm
                      active={calculator.isActive}
                      onClick={() => toggleCalculatorStatus(calculator._id)}
                    >
                      {calculator.isActive ? 'Активен' : 'Неактивен'}
                    </StatusButton>
                  </td>
                  <td data-label="Действия">
                    <ButtonGroup>
                      <EditLink to={`/admin/calculators/${calculator._id}`}>
                        Редактировать
                      </EditLink>
                      <Button
                        sm
                        danger
                        onClick={() => deleteCalculator(calculator._id)}
                      >
                        Удалить
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </AdminContainer>
  );
};

export default AdminCalculators; 