import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminCalculatorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCalculator = !id || id === 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'mortgage',
    description: '',
    interestRate: 9.6,
    minAmount: 300000,
    maxAmount: 30000000,
    minTerm: 1,
    maxTerm: 30,
    minDownPayment: 0,
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Загрузка данных калькулятора при редактировании
  useEffect(() => {
    if (!isNewCalculator) {
      const fetchCalculator = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/api/admin/calculators/${id}`);
          const { name, description, fields, settings } = res.data;
          setFormData({ name, description, fields, settings });
          setLoading(false);
        } catch (err) {
          setError('Ошибка при загрузке данных калькулятора');
          console.error(err);
          setLoading(false);
        }
      };
      
      fetchCalculator();
    }
  }, [id, isNewCalculator]);
  
  // Обработка изменений в форме
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Обработка отправки формы
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (id) {
        await api.put(`/api/admin/calculators/${id}`, formData);
      } else {
        await api.post('/api/admin/calculators', formData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/calculators');
      }, 2000);
    } catch (err) {
      setError('Ошибка при сохранении калькулятора');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !isNewCalculator) {
    return <div>Загрузка...</div>;
  }
  
  return (
    <div className="admin-calculator-form">
      <h2>{isNewCalculator ? 'Добавление калькулятора' : 'Редактирование калькулятора'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Калькулятор успешно сохранен</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Тип калькулятора</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="mortgage">Ипотека</option>
            <option value="carLoan">Автокредит</option>
            <option value="consumerLoan">Потребительский кредит</option>
            <option value="pension">Пенсионные накопления</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label className="form-label">Процентная ставка (%)</label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            className="form-control"
            step="0.1"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Минимальная сумма</label>
          <input
            type="number"
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
            className="form-control"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Максимальная сумма</label>
          <input
            type="number"
            name="maxAmount"
            value={formData.maxAmount}
            onChange={handleChange}
            className="form-control"
            min={formData.minAmount}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Минимальный срок (лет)</label>
          <input
            type="number"
            name="minTerm"
            value={formData.minTerm}
            onChange={handleChange}
            className="form-control"
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Максимальный срок (лет)</label>
          <input
            type="number"
            name="maxTerm"
            value={formData.maxTerm}
            onChange={handleChange}
            className="form-control"
            min={formData.minTerm}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Минимальный первоначальный взнос</label>
          <input
            type="number"
            name="minDownPayment"
            value={formData.minDownPayment}
            onChange={handleChange}
            className="form-control"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <div className="form-check">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="form-check-input"
              id="isActive"
            />
            <label className="form-check-label" htmlFor="isActive">
              Активен
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/calculators')}
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCalculatorEdit;
