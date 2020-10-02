const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

// Customer input validation for inserting new customer to DB.
function validateUser(user) {
  const JoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user, schema);
}

exports.User = User;
exports.customerSchema = userSchema;
exports.validate = validateUser;
