const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

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
  const { error } = validate(req.body);
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

  const { error } = validate(req.body);
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

module.exports = router;
