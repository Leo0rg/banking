import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

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
  const toggleCalculatorStatus = async (id, isActive) => {
    try {
      const res = await api.put(`/api/admin/calculators/${id}`, {
        isActive: !isActive
      });
      
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
    <div className="admin-calculators">
      <h2>Управление калькуляторами</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="admin-actions">
        <Link to="/admin/calculators/new" className="btn btn-primary">
          Добавить новый калькулятор
        </Link>
      </div>
      
      <div className="table-container">
        <table className="table">
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
                  <td>{calculator.name}</td>
                  <td>{getCalculatorTypeName(calculator.type)}</td>
                  <td>{calculator.interestRate}%</td>
                  <td>
                    <button
                      className={`btn btn-sm ${calculator.isActive ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => toggleCalculatorStatus(calculator._id, calculator.isActive)}
                    >
                      {calculator.isActive ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link to={`/admin/calculators/${calculator._id}`} className="btn btn-sm btn-secondary">
                        Редактировать
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteCalculator(calculator._id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCalculators; 