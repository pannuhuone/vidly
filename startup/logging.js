const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  // process.on('uncaughtException', (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  winston.exceptions.handle(
    new winston.transports.File({
      filename: 'exceptions.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  process.on('unhandledRejection', (ex) => {
    // winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
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
};