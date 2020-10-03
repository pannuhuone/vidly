require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const morgan = require('morgan');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/routes')(app);

process.on('uncaughtException', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
);

winston.add(
  new winston.transports.File({
    filename: 'logfile.log',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://192.168.1.57:27117/vidly',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    format: winston.format.combine(winston.format.metadata()),
  })
);

// Sync error
// throw new Error('Something failed during startup!');

// Async error
// const p = Promise.reject(new Error('Something failed miserably!'));
// p.then(() => console.log('Done'));

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined!');
  process.exit(1);
}

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}

// Connect to MongoDB
mongoose
  .connect('mongodb://192.168.1.57:27117/vidly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

// Middlewares

// Listening port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
