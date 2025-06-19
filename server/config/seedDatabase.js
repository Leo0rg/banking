const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Загрузка конфигурации из .env файла
dotenv.config();

// Импорт моделей
const User = require('../models/User');
const Calculator = require('../models/Calculator');

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/banking-calculator')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Создание администратора
const createAdmin = async () => {
  try {
    // Проверка существования администратора
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Администратор уже существует');
      return;
    }
    
    // Создание нового администратора
    const admin = new User({
      name: 'Администратор',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    console.log('Администратор успешно создан');
  } catch (err) {
    console.error('Ошибка при создании администратора:', err);
  }
};

// Создание базовых калькуляторов
const createCalculators = async () => {
  try {
    // Проверка существования калькуляторов
    const calculatorsExist = await Calculator.findOne();
    
    if (calculatorsExist) {
      console.log('Калькуляторы уже существуют');
      return;
    }
    
    // Создание калькуляторов
    const calculators = [
      {
        name: 'Ипотечный калькулятор',
        type: 'mortgage',
        description: 'Калькулятор для расчета ипотеки',
        interestRate: 9.6,
        minAmount: 300000,
        maxAmount: 30000000,
        minTerm: 1,
        maxTerm: 30,
        minDownPayment: 0,
        isActive: true
      },
      {
        name: 'Автокредит',
        type: 'carLoan',
        description: 'Калькулятор для расчета автокредита',
        interestRate: 3.5,
        minAmount: 100000,
        maxAmount: 10000000,
        minTerm: 1,
        maxTerm: 7,
        minDownPayment: 0,
        isActive: true
      },
      {
        name: 'Потребительский кредит',
        type: 'consumerLoan',
        description: 'Калькулятор для расчета потребительского кредита',
        interestRate: 14.5,
        minAmount: 50000,
        maxAmount: 3000000,
        minTerm: 1,
        maxTerm: 7,
        minDownPayment: 0,
        isActive: true
      },
      {
        name: 'Пенсионные накопления',
        type: 'pension',
        description: 'Калькулятор для расчета пенсионных накоплений',
        interestRate: 7.0,
        minAmount: 10000,
        maxAmount: 10000000,
        minTerm: 1,
        maxTerm: 40,
        minDownPayment: 0,
        isActive: true
      }
    ];
    
    await Calculator.insertMany(calculators);
    console.log('Калькуляторы успешно созданы');
  } catch (err) {
    console.error('Ошибка при создании калькуляторов:', err);
  }
};

// Запуск инициализации
const seed = async () => {
  try {
    await createAdmin();
    await createCalculators();
    
    console.log('Инициализация базы данных завершена');
    process.exit(0);
  } catch (err) {
    console.error('Ошибка при инициализации базы данных:', err);
    process.exit(1);
  }
};

seed(); 