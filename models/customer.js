const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
      maxlength: 50,
      required: true,
    },
  })
);

// Customer input validation for inserting new customer to DB.
function validateCustomer(customer) {
  const JoiSchema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(6).max(50).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
