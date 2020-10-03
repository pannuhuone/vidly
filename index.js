const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation');

// Listening port
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
