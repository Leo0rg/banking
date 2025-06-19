const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки авторизации пользователя
const auth = async (req, res, next) => {
  // Получение токена из заголовка
  const token = req.header('x-auth-token');

  // Проверка наличия токена
  if (!token) {
    return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Добавление пользователя в запрос
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Токен недействителен' });
  }
};

// Middleware для проверки прав администратора
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Доступ запрещен. Требуются права администратора' });
  }
};

module.exports = { auth, admin }; 