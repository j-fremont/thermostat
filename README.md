# Projet thermostat

Remplace un thermostat de sèche-serviette déficient par un Node MCU et une application permettant de le contrôler.

Voir wiki.

Lancer le server.

```
export NODEMCU_HOST=192.168.1.11
export NODEMCU_PORT=8000
export NODEJS_HOST=localhost
export NODEJS_PORT=3000
export PATH=/home/fremont/node-v22.17.0-linux-arm64/bin/:$PATH
./start.sh
```

Idem pour lancer le client.

## Docker

Pour build l'image du server.

```
docker build . -t thermostat-server
```

Pour lancer l'image du server.

```
docker run -d -p 9002:9000 \
--restart=always \
--name=thermostat-server \
-e NODEJS_HOST='localhost' \
-e NODEJS_PORT='9000' \
-e NODEMCU_HOST='192.168.1.11' \
-e NODEMCU_PORT='8000' \
-p 9002:9000
-v /home/pi/thermostat/data:/usr/src/app/data
thermostat-server
```

Pour build l'image du client.

```
docker build . -t thermostat-app
```

Pour lancer l'image du client.

```
docker run -d -p 9002:9000 \
--restart=always \
--name=thermostat-app \
-e NODEJS_HOST='localhost' \
-e NODEJS_PORT='9000' \
-p 9002:9000
thermostat-app
```
