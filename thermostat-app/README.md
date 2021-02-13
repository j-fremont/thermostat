
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
[thermostat-app]$ npm install axios --save
```

Install.

```
[thermostat-app]$ npm install
```

Start.
```
[thermostat-app]$ npm start
```

## Docker

Build Docker image.
```
[thermostat-app]$ docker build -t thermostat-app .
```

Run Docker image.
```
[thermostat-app]$ docker run -d -p 3004:3000 \
--restart=always \
--name=thermostat-app \
-e NODEJS_HOST='192.168.1.10' \
thermostat-app
```
