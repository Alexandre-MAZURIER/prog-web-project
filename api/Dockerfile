FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE $PORT
RUN npm run build
CMD [ "node", "dist/main" ]