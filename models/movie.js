const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model(
  'Movies',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      default: 0,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 255,
      default: 0,
    },
  })
);

// Movie input validation for inserting new movie to DB.
function validateMovie(movie) {
  const JoiSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  }).options({ abortEarly: false });

  return JoiSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
