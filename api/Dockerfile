FROM node:17-alpine

WORKDIR /usr/src/app

ENV PORT=3000

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]