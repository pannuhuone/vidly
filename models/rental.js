const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 2,
          maxlength: 100,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };

  return Joi.validate(rental, schema);
}

// Movie input validation for inserting new movie to DB.
function validateRental(rental) {
  const JoiSchema = Joi.object({
    movieId: Joi.objectId().required(), // What client will provide to API!
    customerId: Joi.objectId().required(), // What client will provide to API!
  }).options({ abortEarly: false });

  return JoiSchema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
