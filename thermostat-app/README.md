
# thermostat-app

Create and load dependencies.

```bash
$ npm install -g create-react-app
...
$ cd thermostat
[thermostat]$ create-react-app thermostat-app
...
$ cd thermostat-app
[thermostat-app]$ npm install react react-dom --save
[thermostat-app]$ npm install bootstrap reactstrap --save
[thermostat-app]$ npm install socket.io --save
[thermostat-app]$ npm install cors express --save
[thermostat-app]$ npm install axios --save
[thermostat-app]$ npm install concurrently --save 
[thermostat-app]$ npm install body-parser --save
```

Install.

```
[thermostat-app]$ npm install
```

Run the server.
```
[thermostat-app]$ node server.js
```

Run the client.
```
[thermostat-app]$ npm start
```

Run the client and the server concurrently.
```
[thermostat-app]$ npm run dev
```

## Docker

Build Docker image.
```
[thermostat-app]$ docker build -t thermostat-app .
```

Run Docker image.
```
[thermostat-app]$ docker run -d -p 9002:9002 -p 3004:3000 \
--restart=always \
--name=thermostat-app \
-e MQTT_HOST='192.168.1.10' \
-e NODEJS_HOST='localhost' \
thermostat-app
```
