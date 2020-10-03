const winston = require('winston');
const morgan = require('morgan');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  winston.info('Morgan enabled...');
}

// Listening port
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
