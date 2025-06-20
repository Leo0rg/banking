const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// @route   GET api/calculators
// @desc    Получить все доступные калькуляторы
// @access  Public
router.get('/', async (req, res) => {
  try {
    const calculators = await Calculator.find({ isActive: true });
    res.json(calculators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/calculators/:id
// @desc    Получить калькулятор по ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const calculator = await Calculator.findById(req.params.id);
    
    if (!calculator) {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }
    
    res.json(calculator);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/calculators/calculate/mortgage
// @desc    Расчет ипотеки
// @access  Public
router.post('/calculate/mortgage', async (req, res) => {
  const { propertyPrice, downPayment, term } = req.body;
  
  try {
    // Получение калькулятора ипотеки
    const mortgageCalculator = await Calculator.findOne({ type: 'mortgage', isActive: true });
    
    if (!mortgageCalculator) {
      return res.status(404).json({ msg: 'Калькулятор ипотеки не найден' });
    }
    
    // Расчет ипотеки
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = mortgageCalculator.interestRate / 12 / 100;
    const totalRate = Math.pow(1 + monthlyRate, term * 12);
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
    const requiredIncome = monthlyPayment * 2.5;
    
    res.json({
      loanAmount,
      monthlyPayment,
      totalPayment: monthlyPayment * term * 12,
      requiredIncome,
      interestRate: mortgageCalculator.interestRate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/calculators/calculate/carLoan
// @desc    Расчет автокредита
// @access  Public
router.post('/calculate/carLoan', async (req, res) => {
  const { carPrice, downPayment, term } = req.body;
  
  try {
    // Получение калькулятора автокредита
    const carLoanCalculator = await Calculator.findOne({ type: 'carLoan', isActive: true });
    
    if (!carLoanCalculator) {
      return res.status(404).json({ msg: 'Калькулятор автокредита не найден' });
    }
    
    // Расчет автокредита
    const loanAmount = carPrice - downPayment;
    const monthlyRate = carLoanCalculator.interestRate / 12 / 100;
    const totalRate = Math.pow(1 + monthlyRate, term * 12);
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
    const requiredIncome = monthlyPayment * 2.5;
    
    res.json({
      loanAmount,
      monthlyPayment,
      totalPayment: monthlyPayment * term * 12,
      requiredIncome,
      interestRate: carLoanCalculator.interestRate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/calculators/calculate/consumerLoan
// @desc    Расчет потребительского кредита
// @access  Public
router.post('/calculate/consumerLoan', async (req, res) => {
  const { loanAmount, term } = req.body;
  
  try {
    // Получение калькулятора потребительского кредита
    const consumerLoanCalculator = await Calculator.findOne({ type: 'consumerLoan', isActive: true });
    
    if (!consumerLoanCalculator) {
      return res.status(404).json({ msg: 'Калькулятор потребительского кредита не найден' });
    }
    
    // Расчет потребительского кредита
    const monthlyRate = consumerLoanCalculator.interestRate / 12 / 100;
    const totalRate = Math.pow(1 + monthlyRate, term * 12);
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
    const requiredIncome = monthlyPayment * 2.5;
    
    res.json({
      loanAmount,
      monthlyPayment,
      totalPayment: monthlyPayment * term * 12,
      requiredIncome,
      interestRate: consumerLoanCalculator.interestRate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/calculators/calculate/pension
// @desc    Расчет пенсии
// @access  Public
router.post('/calculate/pension', async (req, res) => {
  const { initialDeposit, monthlyContribution, term } = req.body;

  try {
    const pensionCalculator = await Calculator.findOne({ type: 'pension', isActive: true });

    if (!pensionCalculator) {
      return res.status(404).json({ msg: 'Пенсионный калькулятор не найден' });
    }

    const interestRate = pensionCalculator.interestRate / 100;
    const monthlyRate = interestRate / 12;
    const totalMonths = term * 12;

    const futureValueInitial = initialDeposit * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueMonthly = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const totalSavings = futureValueInitial + futureValueMonthly;

    const pensionDurationMonths = 20 * 12; // Предполагаемый срок выплаты пенсии 20 лет
    const monthlyPension = totalSavings / pensionDurationMonths;

    res.json({
      totalSavings,
      monthlyPension,
      interestRate: pensionCalculator.interestRate,
      totalContributions: initialDeposit + (monthlyContribution * totalMonths),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

const generateEmailHtml = (calculationType, calculationResults) => {
  const titles = {
    mortgage: 'Ипотечный калькулятор',
    carLoan: 'Автокредитный калькулятор',
    consumerLoan: 'Калькулятор потребительского кредита',
    pension: 'Пенсионный калькулятор',
  };

  const labels = {
    loanAmount: 'Сумма кредита',
    monthlyPayment: 'Ежемесячный платеж',
    totalPayment: 'Общая сумма выплат',
    requiredIncome: 'Необходимый доход',
    interestRate: 'Процентная ставка',
    totalSavings: 'Итоговые накопления',
    monthlyPension: 'Ежемесячная пенсия',
    totalContributions: 'Сумма взносов',
  };

  const formatValue = (key, value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return value;
    }

    if (key === 'interestRate') {
      return `${numericValue.toFixed(2)}%`;
    }
    if (['loanAmount', 'monthlyPayment', 'totalPayment', 'requiredIncome', 'totalSavings', 'monthlyPension', 'totalContributions'].includes(key)) {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2 }).format(numericValue);
    }
    return numericValue;
  };

  let resultsHtml = '';
  for (const [key, value] of Object.entries(calculationResults)) {
    if (labels[key]) {
      resultsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${labels[key]}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;"><strong>${formatValue(key, value)}</strong></td>
        </tr>
      `;
    }
  }

  const calculationTitle = titles[calculationType] || calculationType;

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #f7f7f7; padding: 20px; text-align: center;">
        <h1 style="color: #0056b3; margin: 0;">Ваш расчет готов</h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #333;">Результаты расчета: ${calculationTitle}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tbody>
            ${resultsHtml}
          </tbody>
        </table>
        <p style="margin-top: 30px; font-size: 12px; color: #777;">
          Это предварительный расчет. Для получения точной информации и оформления, пожалуйста, обратитесь в отделение банка.
        </p>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        <p style="margin: 0;">С уважением, Ваш Банк</p>
      </div>
    </div>
  `;
};

// @route   POST api/calculators/email
// @desc    Отправка результатов расчета на почту
// @access  Private
router.post('/email', auth, async (req, res) => {
  const { email, subject, calculationType, calculationResults } = req.body;
  console.log(`Получен запрос на отправку результатов на почту: ${email}`);
  
  try {
    console.log('Создание транспорта для nodemailer...');
    // Создание транспорта для отправки почты
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      logger: true,
      debug: true
    });
    console.log('Транспорт успешно создан.');
    
    // Формирование HTML-письма
    const mailHtml = generateEmailHtml(calculationType, calculationResults);
    
    // Опции письма
    const mailOptions = {
      from: `"Ваш Банк" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject || `Результаты Вашего расчета`,
      html: mailHtml,
      text: 'Ваш почтовый клиент не поддерживает HTML. Пожалуйста, используйте другой для просмотра этого письма.'
    };
    
    console.log('Попытка отправки письма с опциями:', mailOptions);
    // Отправка письма
    await transporter.sendMail(mailOptions);
    
    console.log(`Письмо успешно отправлено на ${email}`);
    res.json({ msg: 'Результаты успешно отправлены на почту' });
  } catch (err) {
    console.error('Ошибка при отправке письма:', err);
    res.status(500).send('Ошибка при отправке почты');
  }
});

module.exports = router; 