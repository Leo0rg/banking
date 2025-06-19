const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Calculator = require('./models/Calculator');

// Загрузка конфигурации из .env файла
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/calculators', calculatorRoutes);
app.use('/api/admin', adminRoutes);

// Функция для начального заполнения БД
const seedDatabase = async () => {
  try {
    const count = await Calculator.countDocuments();
    if (count === 0) {
      const calculators = [
        {
          name: 'Ипотечный калькулятор',
          type: 'mortgage',
          description: 'Рассчитайте ежемесячный платеж по ипотеке.',
          interestRate: 9.6,
          minAmount: 300000,
          maxAmount: 30000000,
          minTerm: 1,
          maxTerm: 30,
          minDownPayment: 10,
          isActive: true
        },
        {
          name: 'Калькулятор автокредита',
          type: 'carLoan',
          description: 'Рассчитайте ежемесячный платеж по автокредиту.',
          interestRate: 12.5,
          minAmount: 100000,
          maxAmount: 5000000,
          minTerm: 1,
          maxTerm: 7,
          minDownPayment: 20,
          isActive: true
        },
        {
          name: 'Калькулятор потребительского кредита',
          type: 'consumerLoan',
          description: 'Рассчитайте ежемесячный платеж по потребительскому кредиту.',
          interestRate: 15,
          minAmount: 50000,
          maxAmount: 3000000,
          minTerm: 1,
          maxTerm: 5,
          minDownPayment: 0,
          isActive: true
        },
        {
          name: 'Пенсионный калькулятор',
          type: 'pension',
          description: 'Рассчитайте будущую пенсию.',
          interestRate: 6, // Примерная доходность
          minAmount: 1000,
          maxAmount: 10000000,
          minTerm: 5,
          maxTerm: 40,
          minDownPayment: 0,
          isActive: true
        }
      ];
      await Calculator.insertMany(calculators);
      console.log('Database seeded with calculators');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/banking-calculator')
  .then(() => {
    console.log('MongoDB connected');
    seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Определение порта
const PORT = process.env.PORT || 5000;

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 