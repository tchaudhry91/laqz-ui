FROM node:15
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build

FROM nginx:alpine
RUN mkdir /app
COPY --from=0 /app/public /app
COPY nginx.conf /etc/nginx/nginx.conf