
var config = module.exports = {};

config.mqtt = {
  host: '${MQTT_HOST}',
  port: 1883
};

config.server = {
  host: '${NODEJS_HOST}',
  port: 9002
};

