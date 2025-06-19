const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');
const { auth, admin } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Middleware для проверки данных калькулятора
const validateCalculator = [
  check('name', 'Имя калькулятора обязательно').not().isEmpty(),
  check('type', 'Тип калькулятора обязателен').isIn(['mortgage', 'carLoan', 'consumerLoan', 'pension']),
  check('description', 'Описание калькулятора обязательно').not().isEmpty(),
  check('interestRate', 'Процентная ставка обязательна').isNumeric(),
  check('minAmount', 'Минимальная сумма обязательна').isNumeric(),
  check('maxAmount', 'Максимальная сумма обязательна').isNumeric(),
  check('minTerm', 'Минимальный срок обязателен').isNumeric(),
  check('maxTerm', 'Максимальный срок обязателен').isNumeric()
];

// @route   GET api/admin/calculators
// @desc    Получить все калькуляторы (включая неактивные)
// @access  Private/Admin
router.get('/calculators', [auth, admin], async (req, res) => {
  try {
    const calculators = await Calculator.find();
    res.json(calculators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/admin/calculators
// @desc    Создать новый калькулятор
// @access  Private/Admin
router.post('/calculators', [auth, admin, validateCalculator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    type,
    description,
    interestRate,
    minAmount,
    maxAmount,
    minTerm,
    maxTerm,
    minDownPayment,
    isActive
  } = req.body;

  try {
    // Проверка существования калькулятора с таким именем
    let calculator = await Calculator.findOne({ name });
    if (calculator) {
      return res.status(400).json({ errors: [{ msg: 'Калькулятор с таким именем уже существует' }] });
    }

    // Создание нового калькулятора
    calculator = new Calculator({
      name,
      type,
      description,
      interestRate,
      minAmount,
      maxAmount,
      minTerm,
      maxTerm,
      minDownPayment: minDownPayment || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await calculator.save();
    res.json(calculator);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/admin/calculators/:id
// @desc    Обновить калькулятор
// @access  Private/Admin
router.put('/calculators/:id', [auth, admin, validateCalculator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    type,
    description,
    interestRate,
    minAmount,
    maxAmount,
    minTerm,
    maxTerm,
    minDownPayment,
    isActive
  } = req.body;

  // Создание объекта с обновленными данными
  const calculatorFields = {};
  if (name) calculatorFields.name = name;
  if (type) calculatorFields.type = type;
  if (description) calculatorFields.description = description;
  if (interestRate) calculatorFields.interestRate = interestRate;
  if (minAmount) calculatorFields.minAmount = minAmount;
  if (maxAmount) calculatorFields.maxAmount = maxAmount;
  if (minTerm) calculatorFields.minTerm = minTerm;
  if (maxTerm) calculatorFields.maxTerm = maxTerm;
  if (minDownPayment !== undefined) calculatorFields.minDownPayment = minDownPayment;
  if (isActive !== undefined) calculatorFields.isActive = isActive;

  try {
    // Проверка существования калькулятора
    let calculator = await Calculator.findById(req.params.id);
    if (!calculator) {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }

    // Обновление калькулятора
    calculator = await Calculator.findByIdAndUpdate(
      req.params.id,
      { $set: calculatorFields },
      { new: true }
    );

    res.json(calculator);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/admin/calculators/:id
// @desc    Удалить калькулятор
// @access  Private/Admin
router.delete('/calculators/:id', [auth, admin], async (req, res) => {
  try {
    // Проверка существования калькулятора
    const calculator = await Calculator.findById(req.params.id);
    if (!calculator) {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }

    // Удаление калькулятора
    await calculator.remove();
    res.json({ msg: 'Калькулятор удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Калькулятор не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 