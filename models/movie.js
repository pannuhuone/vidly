const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  genre: {
    // What will be put to DB!
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
});

const Movie = mongoose.model('Movies', movieSchema);

// Movie input validation for inserting new movie to DB.
function validateMovie(movie) {
  // console.log('movie schema validator');
  const JoiSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    genreId: Joi.objectId().required(), // What client will provide to API!
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  }).options({ abortEarly: false });

  return JoiSchema.validate(movie);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovie;
