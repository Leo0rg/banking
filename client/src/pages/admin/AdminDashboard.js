import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Панель управления администратора</h2>
      </div>
      
      <div className="admin-cards">
        <div className="admin-card">
          <h3>Управление калькуляторами</h3>
          <p>Добавление, редактирование и удаление калькуляторов</p>
          <Link to="/admin/calculators" className="btn btn-primary">
            Управление калькуляторами
          </Link>
        </div>
        
        <div className="admin-card">
          <h3>Пользователи</h3>
          <p>Управление пользователями системы</p>
          <button className="btn btn-secondary" disabled>
            Функция в разработке
          </button>
        </div>
      </div>
      
      <div className="admin-section">
        <h3>Быстрые действия</h3>
        <div className="admin-actions">
          <Link to="/admin/calculators/new" className="btn btn-primary">
            Добавить новый калькулятор
          </Link>
        </div>
      </div>
      
      <div className="admin-section">
        <h3>Информация о системе</h3>
        <div className="admin-info">
          <div className="info-item">
            <span>Версия системы:</span>
            <span>1.0.0</span>
          </div>
          <div className="info-item">
            <span>Последнее обновление:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
