FROM node:20.8.1 as builder

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001:4001

CMD ["npm", "start"]
