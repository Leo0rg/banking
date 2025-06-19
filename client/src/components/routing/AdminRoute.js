import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute; 