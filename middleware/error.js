const winston = require('winston');

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  // Log the exception
  return res.status(500).send('Something failed.');
};
