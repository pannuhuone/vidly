const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');

// POST /api/returns {customerId, movieId}
router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');

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

module.exports = router;