const winston = require('winston');
const morgan = require('morgan');
const config = require('config');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();

if (!config.get('jwtPrivateKey')) {
  winston.error('FATAL ERROR: jwtPrivateKey is not defined!');
  process.exit(1);
}

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  winston.info('Morgan enabled...');
}

// Listening port
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
