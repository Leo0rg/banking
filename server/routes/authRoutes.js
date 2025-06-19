const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Middleware для проверки валидности данных
const validateRegistration = [
  check('name', 'Имя обязательно').not().isEmpty(),
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 })
];

const validateLogin = [
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Пароль обязателен').exists()
];

// @route   POST api/auth/register
// @desc    Регистрация пользователя
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Пользователь с таким email уже существует' }] });
    }

    // Создание нового пользователя
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Создание JWT токена
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/auth/login
// @desc    Аутентификация пользователя и получение токена
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Неверные учетные данные' }] });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Неверные учетные данные' }] });
    }

    // Создание JWT токена
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route    GET api/auth/user
// @desc     Get user by token
// @access   Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 