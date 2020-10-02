const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

// API: Add new user (POST)
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }

  res.send(user);
});

module.exports = router;
