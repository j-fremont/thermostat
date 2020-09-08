'use strict';

const app = require('express')();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const config = require('./src/config');
//const mqtt = require('mqtt');
const net = require('net');

var stateRouter = require('./routes/state');

app.use(cors());

app.use('/state', stateRouter);

/*const client = mqtt.connect('mqtt://' + config.mqtt.host + ':' + config.mqtt.port);

client.on('connect', () => {
  console.log('mqtt connected');
});*/

io.on('connection', socket => {
  console.log('web socket connected');

  socket.on('disconnect', () => {
    console.log('web socket disconnected');
  });

  socket.on('sock_thermostat', (payload) => {

		sendMCU(payload);

    let stringified = JSON.stringify(payload);

		const repeat = parseInt(payload.repeat.toString());

		if (payload.mode==='forced' && repeat!==0) { // If mode forced for repeat x 5 minutes...

			setTimeout(() => {

				fs.readFile("state.json", (error, stringified) => { // ...restore previous state after repeat x 5 minutes.
		    	if (error) {
		      	throw err;
		    	}

					sendMCU(JSON.parse(stringified));
		  	});

			}, repeat * 300000);

		} else {

		  fs.writeFile("state.json", stringified, (error) => {
		    if (error) {
		      throw err;
		    }
		  });
		}

  });
});

const sendMCU = (json) => {

	const buffer = bufferize(json)+'E';
	console.log(buffer);
		
	var client = new net.Socket();
		client.connect(config.nodemcu.port, config.nodemcu.host, function() {
			console.log('Connected');
			client.write(buffer);
	});
}

const bufferize = (json) => {
  var mode;
  switch(json.mode) {
    case 'auto':
      var slots = '';
      json.slots.forEach(slot => {
        const start = slot.start.split(':')[0].toString() + slot.start.split(':')[1].toString();
        const end = slot.end.split(':')[0].toString() + slot.end.split(':')[1].toString();
				//const utc = slot.utc ? '2' : '1';
        var days = '';
        slot.days.forEach(day => {
          days += day ? '1' : '0';
        });				
        //slots += ('0' + slot.value.toString()).slice(-2) + start + end + utc + days;
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
