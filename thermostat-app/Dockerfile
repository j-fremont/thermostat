FROM balenalib/rpi-alpine-node:latest

RUN apk update && apk add gettext

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "start.sh"]

