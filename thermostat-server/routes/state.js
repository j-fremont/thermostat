'use strict';

const express = require('express');
const router = express.Router();
const net = require('net');
const fs = require('fs');
const config = require('../config');

router.get('/', (req, res) => {
  fs.readFile("./data/state.json", (error, data) => {
    if (error) throw error;
    res.send(JSON.parse(data));
  });
});

router.post('/', (req, res) => {
  sendMCU(req.body);
  res.sendStatus(200);
});

const sendMCU = (json) => {

  const buffer = bufferize(json)+'E';
  
  console.log(buffer);

  var client = new net.Socket();
    client.connect(config.nodemcu.port, config.nodemcu.host, function() {
      console.log('Connected');
      client.write(buffer);
  });
  
  let stringified = JSON.stringify(json);
  
  fs.writeFile("./data/state.json", stringified, (error) => {
    if (error) {
      throw err;
    }
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

module.exports = router;
