# Build server
FROM node:17.4-alpine as build-stage-server
WORKDIR /usr/src/app

ENV API_PATH=api

# Install OpenSSL
RUN apk update \
	&& apk add --no-cache openssl \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/*

# Generate a self-signed certificate
RUN mkdir -p secrets \
    && openssl req -x509 -days 365 -out secrets/public-certificate.crt -keyout secrets/private-key.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/C=FR/CN=localhost' -extensions EXT -config <( \
    printf '[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth')

# Copy the source code
COPY ${API_PATH}/package*.json .
RUN npm ci
COPY ${API_PATH} .
RUN npm run build

# Build client
FROM node:17.4-alpine as build-stage-client
WORKDIR /usr/src/app

ENV CLIENT_PATH=client

COPY ${CLIENT_PATH}/package*.json .
RUN npm ci
COPY ${CLIENT_PATH} .
RUN npm run build

# Build image
FROM node:17.4-alpine as production-stage
WORKDIR /usr/src/app

ENV API_PATH=api
COPY ${API_PATH}/package*.json ./
RUN npm ci

COPY --from=build-stage-server /usr/src/app/dist .
COPY --from=build-stage-server /usr/src/app/secrets secrets
COPY --from=build-stage-client /usr/src/app/build public
EXPOSE $HTTP_PORT
EXPOSE $HTTPS_PORT
CMD [ "node", "main" ]