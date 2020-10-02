const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    genre: {
      type: Object,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
      default: 0,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      default: 0,
    },
  })
);

// Movie input validation for inserting new movie to DB.
function validateMovie(movie) {
  const JoiSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    genre: Joi.object().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  }).options({ abortEarly: false });

  return JoiSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
