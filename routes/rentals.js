const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');

// API: Get all rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('name');
  res.send(rentals);
});

module.exports = router;
