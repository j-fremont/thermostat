
# thermostat-server

Create and load dependencies.

```bash
$ mkdir thermostat-server
$ cd thermostat-server
[thermostat-server]$ npm init -y
[thermostat-server]$ npm install socket.io --save
[thermostat-server]$ npm install cors express --save
[thermostat-server]$ npm install body-parser --save
```

Install.

```
[thermostat-server]$ npm install
```

Start.
```
[thermostat-server]$ node server-http.js
```

## Docker

Build Docker image.
```
[thermostat-server]$ docker build -t thermostat-server .
```

Run Docker image.
```
[thermostat-app]$ docker run -d -p 9002:9000 \
--restart=always \
--name=thermostat-app \
-e NODEJS_HOST='192.168.1.10' \
-e NODEMCU_HOST='192.168.1.11' \
-v /home/pi/thermostat/data:/usr/src/app/data
thermostat-server
```