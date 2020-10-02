const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const Rental = mongoose.model(
  'Rentals',
  new mongoose.Schema({
    movie: {
      type: movieSchema,
      required: true,
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    rentalDate: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  })
);

// Movie input validation for inserting new movie to DB.
function validateRental(movie) {
  const JoiSchema = Joi.object({
    movie: Joi.string().required(), // What client will provide to API!
    customer: Joi.string().required(), // What client will provide to API!
    rentalDate: Joi.date(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(movie);
}

exports.Rental = Rental;
exports.validate = validateRental;
