# Build api
FROM node:17.6-alpine as build-api
WORKDIR /usr/src/app

ENV API_PATH=api

# Copy the source code
COPY ${API_PATH}/package*.json ./
RUN npm ci
COPY ${API_PATH} .

RUN npm run build

# Build client
FROM node:17.6-alpine as build-client
WORKDIR /usr/src/app

ENV CLIENT_PATH=client

COPY ${CLIENT_PATH}/package*.json ./
RUN npm ci
COPY ${CLIENT_PATH} .

RUN npm run build

# Build production image
FROM --platform=linux/amd64 node:17.6-alpine as production-build
WORKDIR /usr/src/app

ENV API_PATH=api
ENV USER=docker
ENV REACT_APP_API_URL=http://localhost:3000/

COPY ${API_PATH}/package*.json ./
RUN npm ci

COPY --from=build-api /usr/src/app/dist .
COPY --from=build-client /usr/src/app/build public

RUN adduser -D -H ${USER}
USER ${USER}

EXPOSE $HTTP_PORT
EXPOSE $PORT

EXPOSE $HTTPS_PORT

CMD [ "node", "main" ]