'use strict';

const app = require('express')();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const config = require('./src/config');
const axios = require('axios');

var stateRouter = require('./routes/state');

app.use(cors());

app.use('/state', stateRouter);

io.on('connection', socket => {
  console.log('web socket connected');

  socket.on('disconnect', () => {
    console.log('web socket disconnected');
  });

  socket.on('sock_thermostat', (payload) => {
    const json = JSON.stringify(payload);
    const buffer = bufferize(payload);

	  fs.writeFile("state.json", json, error => {
	    if (error) throw error;
	  });

    axios({
      method: 'post',
      url: 'http://192.168.1.11/' + buffer,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: 'app-message:' + buffer 
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  });
});

const bufferize = (json) => {
  var mode;
  switch(json.mode) {
    case 'auto':
      var slots = '';
      json.slots.forEach(slot => {
        const start = slot.start.split(':')[0].toString() + slot.start.split(':')[1].toString();
        const end = slot.end.split(':')[0].toString() + slot.end.split(':')[1].toString();
        var days = '';
        slot.days.forEach(day => {
          days += day ? '1' : '0';
        });				
        slots += ('0' + slot.value.toString()).slice(-2) + start + end + days;
      });
      return '1' + ('0' + json.normal.toString()).slice(-2) + json.slots.length.toString()  + slots;
    case 'forced':
      return '2' + ('0' + json.forced.toString()).slice(-2);
    default:
      return '0';
  }
}

http.listen(config.server.port, () => {
  console.log('listening on *:' + config.server.port);
});
