FROM node:latest AS builder

COPY package.json package.json
RUN npm install

COPY create-env-file.sh ./create-env-file.sh
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH_API_URL
RUN sh create-env-file.sh REACT_APP_API_URL=$REACT_APP_API_URL REACT_APP_AUTH_API_URL=$REACT_APP_AUTH_API_URL

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /build /usr/share/nginx/html
COPY --from=builder nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]