FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "BACKEND_URL=${BACKEND_URL} yarn start"]