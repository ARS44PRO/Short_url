FROM node:20-alpine

WORKDIR /app_backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
