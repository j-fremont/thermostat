#!/bin/sh

envsubst < config-model.js > config.js

node server-http.js
