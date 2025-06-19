import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formError, setFormError] = useState('');
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }
    
    const success = await register({
      name,
      email,
      password
    });
    
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <div className="auth-page">
      <h2>Регистрация</h2>
      
      {(error || formError) && (
        <div className="alert alert-danger">{error || formError}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Имя</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="form-control"
            minLength="6"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Подтверждение пароля</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="form-control"
            minLength="6"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-block">
          Зарегистрироваться
        </button>
      </form>
      
      <Link to="/login" className="auth-link">
        Уже есть аккаунт? Войдите
      </Link>
    </div>
  );
};

export default Register;
