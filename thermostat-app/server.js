'use strict';

const app = require('express')();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mqtt = require('mqtt');
const fs = require('fs');
const config = require('./src/config');

var stateRouter = require('./routes/state');

app.use(cors());

app.use('/state', stateRouter);

const client = mqtt.connect('mqtt://' + config.mqtt.host + ':' + config.mqtt.port);

client.on('connect', () => {
  console.log('mqtt connected');
});

io.on('connection', socket => {
  console.log('web socket connected');

  socket.on('disconnect', () => {
    console.log('web socket disconnected');
  });

  socket.on('sock_thermostat', (payload) => {
    console.log(payload);
    const json = JSON.stringify(payload);
    client.publish('thermostat', json, (error) => {
      if (error) {
        console.log(error);
      } else {
        fs.writeFile("state.json", json, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  });
});

http.listen(config.server.port, () => {
  console.log('listening on *:' + config.server.port);
});
