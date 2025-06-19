import React, { createContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/api/auth/user');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Сессия истекла. Пожалуйста, войдите снова.');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Ошибка регистрации');
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/api/auth/login', formData);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Неверные учетные данные');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const contextValue = useMemo(() => ({
    token,
    isAuthenticated,
    loading,
    user,
    error,
    register,
    login,
    logout,
    isAdmin,
  }), [token, isAuthenticated, loading, user, error, isAdmin]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 