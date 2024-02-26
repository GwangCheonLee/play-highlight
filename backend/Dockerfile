# Stage 1: Build the application
FROM node:alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the application
FROM node:alpine

WORKDIR /usr/src/app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
