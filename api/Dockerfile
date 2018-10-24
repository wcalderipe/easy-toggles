FROM node:8-alpine

RUN apk update

EXPOSE 8080

ENV HOME=/home/api
ENV PORT=8080

WORKDIR /api

COPY package.json package-lock.json /api/

RUN npm install --progress=false

COPY . .

RUN npm run build

CMD npm run start:prod
