const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

// POST /api/returns {customerId, movieId}
router.post('/', auth, async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId});
  if (!rental) return res.status(404).send('rental not found');

  if(rental.dateReturned) return res.status(400).send('Return already processed');
  
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays *rental.movie.dailyRentalRate;
  await rental.save();
  // -- Own solution for calculating rentalFee --
  // const oneDay = 24 * 60 * 60 * 1000;
  // var diffDays = Math.round(Math.abs((rental.dateOut.getTime() - rental.dateReturned.getTime()) / (oneDay)));

  // rental.rentalFee = diffDays * rental.movie.dailyRentalRate;
  // await rental.save();
  
  await Movie.update({ _id: rental.movie._id}, {
    $inc: { numberInStock: 1 }
  });
  // -- Own solution for increasing the movie stock --
  // const movie = await Movie.findOne({
  //   '_id': req.body.movieId
  // });
  // movie.numberInStock++;
  // await movie.save();

  res.status(200).send(rental);
});

function validateReturn(req) {
  const JoiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(req);
}

module.exports = router;