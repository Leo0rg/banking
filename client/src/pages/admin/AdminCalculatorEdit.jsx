import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  font-family: 'Dela Gothic One';
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3em;
`;

const Textarea = styled.textarea`
  font-family: 'Dela Gothic One';
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
`;

const Select = styled.select`
  font-family: 'Dela Gothic One';
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3em;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 0.5rem;
  }
`;

const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  font-family: 'Dela Gothic One';
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 3em;
  cursor: pointer;
  background-color: ${props => props.primary ? '#A3FF32' : 'black'};
  color: white;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 3em;
  color: #fff;
  background-color: ${props => props.success ? '#A3FF32' : '#dc3545'};
`;

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
          setFormData(res.data);
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
    <FormContainer>
      <Title>{isNewCalculator ? 'Добавление калькулятора' : 'Редактирование калькулятора'}</Title>
      
      {error && <Alert>{error}</Alert>}
      {success && <Alert success>Калькулятор успешно сохранен</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup className="full-width">
          <Label>Название</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Тип калькулятора</Label>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="mortgage">Ипотека</option>
            <option value="carLoan">Автокредит</option>
            <option value="consumerLoan">Потребительский кредит</option>
            <option value="pension">Пенсионные накопления</option>
          </Select>
        </FormGroup>
        
        <FormGroup className="full-width">
          <Label>Описание</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          ></Textarea>
        </FormGroup>
        
        <FormGroup>
          <Label>Процентная ставка (%)</Label>
          <Input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            step="0.1"
            min="0"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Минимальная сумма</Label>
          <Input
            type="number"
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Максимальная сумма</Label>
          <Input
            type="number"
            name="maxAmount"
            value={formData.maxAmount}
            onChange={handleChange}
            min={formData.minAmount}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Минимальный срок (лет)</Label>
          <Input
            type="number"
            name="minTerm"
            value={formData.minTerm}
            onChange={handleChange}
            min="1"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Максимальный срок (лет)</Label>
          <Input
            type="number"
            name="maxTerm"
            value={formData.maxTerm}
            onChange={handleChange}
            min={formData.minTerm}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Минимальный первоначальный взнос</Label>
          <Input
            type="number"
            name="minDownPayment"
            value={formData.minDownPayment}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>
        
        <FormGroup>
          <CheckboxContainer>
            <Input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              id="isActive"
            />
            <Label htmlFor="isActive">
              Активен
            </Label>
          </CheckboxContainer>
        </FormGroup>
        
        <FormActions>
          <Button primary type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/admin/calculators')}
            disabled={loading}
          >
            Отмена
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  );
};

export default AdminCalculatorEdit;
