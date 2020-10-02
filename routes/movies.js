const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');

// API: Get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// API: Get one customer
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given movie ID is not valid!');
  }

  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send('The movie with given ID was not found');

  res.send(movie);
});

// API: Add new movie (POST)
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    movie = await movie.save();
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }

  res.send(movie);
});

// API: Change one movie (PUT)
router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given movie ID is not valid!');
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send('The movie with given ID was not found');

  res.send(movie);
});

// API: Delete one movie (DELETE)
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Given movie ID is not valid!');
  }

  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with given ID was not found');
  res.send(movie);
});

module.exports = router;
