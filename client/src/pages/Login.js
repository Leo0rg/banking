import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    const success = await login(formData);
    
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <div className="auth-page">
      <h2>Вход в систему</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
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
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-block">
          Войти
        </button>
      </form>
      
      <Link to="/register" className="auth-link">
        Нет аккаунта? Зарегистрируйтесь
      </Link>
    </div>
  );
};

export default Login;
