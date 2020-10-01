const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const { func } = require('@hapi/joi');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    isGold: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    phone: {
      type: String,
      minlength: 6,
      maxlength: 12,
      required: true,
    },
  })
);

// API: Get all customers
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// API: Get one customer
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given customer ID is not valid!');
  }

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    res.status(404).send('The customer with given ID was not found');

  res.send(customer);
});

// API: Add new customer (POST)
router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  try {
    customer = await customer.save();
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }

  res.send(customer);
});

// API: Change one customer (PUT)
router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given customer ID is not valid!');
  }

  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res.status(404).send('The customer with given ID was not found');

  res.send(customer);
});

// API: Delete one customer (DELETE)
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given customer ID is not valid!');
  }

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send('The customer with given ID was not found');
  res.send(customer);
});

// Customer input validation for inserting new customer to DB.
function validateCustomer(customer) {
  const JoiSchema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(6).max(12).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(customer);
}

module.exports = router;
