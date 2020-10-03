const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  // Connect to MongoDB
  mongoose
    .connect('mongodb://192.168.1.57:27117/vidly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
};
