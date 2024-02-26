# Build stage
FROM node:alpine AS build
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
