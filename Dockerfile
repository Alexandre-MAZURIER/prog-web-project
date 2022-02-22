# Build server
FROM node:17.4-alpine as build-api
WORKDIR /usr/src/app

ENV API_PATH=api

# Copy the source code
COPY ${API_PATH}/package*.json .
RUN npm ci
COPY ${API_PATH} .
RUN npm run build

# Build client
FROM node:17.4-alpine as build-client
WORKDIR /usr/src/app

ENV CLIENT_PATH=client

COPY ${CLIENT_PATH}/package*.json .
RUN npm ci
COPY ${CLIENT_PATH} .
RUN npm run build

# Build image
FROM --platform=linux/amd64 node:17.4-alpine
WORKDIR /usr/src/app

ENV API_PATH=api
COPY ${API_PATH}/package*.json ./
RUN npm ci

COPY --from=build-stage-server /usr/src/app/dist .
COPY --from=build-stage-server /usr/src/app/secrets secrets
COPY --from=build-stage-client /usr/src/app/build public

ENV USER=docker
RUN adduser -D -H ${USER}
USER ${USER}

EXPOSE $HTTP_PORT
EXPOSE $HTTPS_PORT
CMD [ "node", "main" ]