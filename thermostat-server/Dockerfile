FROM balenalib/rpi-alpine-node:3.14

RUN apk update && apk add gettext

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

EXPOSE 9000

ENTRYPOINT ["/bin/sh", "start.sh"]

