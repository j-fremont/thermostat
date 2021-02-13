#!/bin/sh

envsubst < src/config-model.js > src/config.js

npm start
