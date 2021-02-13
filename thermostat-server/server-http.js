'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);

const config = require('./config');

var stateRouter = require('./routes/state');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use('/state', stateRouter);

http.listen(config.server.port, () => {
  console.log('listening on *:' + config.server.port);
});
