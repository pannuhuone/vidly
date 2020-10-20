const express = require('express');
const { Rental } = require('../models/rental');
const router = express.Router();
// const auth = require('../middleware/auth');

// POST /api/returns {customerId, movieId}
router.post('/', async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');

  const rental = await Rental.findOne({
    'customer._id': req.params.customerId, 
    'movie._id': req.params.movieId});
  if (!rental) return res.status(404).send('rental not found');

  res.status(401).send('Unauthorized');
});

module.exports = router;