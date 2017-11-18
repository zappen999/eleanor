FROM node:8.9.1
MAINTAINER Johan Kanefur <johan.canefur@gmail.com>

WORKDIR /home/node/app

COPY scripts ./scripts
COPY src ./src
COPY package.json .
COPY package.lock .
COPY tsconfig.json .

RUN npm install

ENTRYPOINT [ "bash", "./scripts/entrypoint.sh" ]
