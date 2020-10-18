const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

// Genre input validation for inserting new genre to DB.
function validateGenre(genre) {
  const JoiSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
