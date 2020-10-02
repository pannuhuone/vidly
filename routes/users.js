const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User, validate } = require('../models/user');

// API: Add new user (POST)
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  try {
    await user.save();
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }

  res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
