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
		const buffer = bufferize(payload);
    //client.publish('thermostat', json, (error) => {
    client.publish('thermostat', buffer, (error) => {
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

const bufferize = (json) => {
	var mode;
	switch(json.mode) {
		case 'auto':
			var ranges = '';
			json.ranges.forEach(range => {
				const start = range.start.split(':')[0].toString() + range.start.split(':')[1].toString();
				const end = range.end.split(':')[0].toString() + range.end.split(':')[1].toString();
				var days = '';
				range.days.forEach(day => {
					days += day ? '1' : '0';
				});				
				ranges += range.value.toString() + start + end + days;
			});
			return '1' + json.normal.toString() + ranges;
		case 'forced':
			return '2' + json.forced.toString();
		default:
			return '0';
	}
}

http.listen(config.server.port, () => {
  console.log('listening on *:' + config.server.port);
});
