FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npx typeorm migration:run -d ./db_conf/ormconfig.ts && npm run start:prod"]