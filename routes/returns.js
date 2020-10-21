const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const auth = require('../middleware/auth');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)
const validate = require('../middleware/validate');

// POST /api/returns {customerId, movieId}
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  
  if (!rental) return res.status(404).send('rental not found');

  if(rental.dateReturned) return res.status(400).send('Return already processed');
  
  rental.return();
  await rental.save();
  
  await Movie.update({ _id: rental.movie._id}, {
    $inc: { numberInStock: 1 }
  });

  res.send(rental);
});

function validateReturn(req) {
  const JoiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(req);
}

module.exports = router;