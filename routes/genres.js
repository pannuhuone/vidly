const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const { func } = require('@hapi/joi');

const Genre = mongoose.model(
  'Genre',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
  })
);

// API: Get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// API: Get one genre
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given genre ID is not valid!');
  }

  const genre = await Genre.findById(req.params.id);
  if (!genre) res.status(404).send('The genre with given ID was not found');

  res.send(genre);
});

// API: Add new genre (POST)
router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  try {
    genre = await genre.save();
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }

  res.send(genre);
});

// API: Change one genre (PUT)
router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given genre ID is not valid!');
  }

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send('The genre with given ID was not found');

  res.send(genre);
});

// API: Delete one genre (DELETE)
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given genre ID is not valid!');
  }

  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with given ID was not found');
  res.send(genre);
});

// Genre input validation for inserting new genre to DB.
function validateGenre(genre) {
  const JoiSchema = Joi.object({
    name: Joi.string().min(3).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(genre);
}

module.exports = router;
