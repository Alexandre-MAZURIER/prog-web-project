FROM node:17.4-alpine as build-stage
WORKDIR /usr/src/app

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
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:17.4-alpine as production-stage
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json .
RUN npm ci

# Copy compiled files and certificates
COPY --from=build-stage /usr/src/app/dist .
COPY --from=build-stage /usr/src/app/secrets secrets

# Expose ports
EXPOSE $HTTP_PORT
EXPOSE $HTTPS_PORT

# Run the app
CMD [ "node", "main" ]
