FROM node:17-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL
RUN npm run build

FROM nginx:1.21-alpine as production-stage
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh
EXPOSE $PORT
ENTRYPOINT [ "start-nginx.sh" ]