FROM node:8-alpine

RUN apk update

EXPOSE 8080

ONBUILD ARG BUILD_CONTEXT

ENV HOME=/home/api
ENV PORT=8080

WORKDIR /api

COPY ${BUILD_CONTEXT}/package.json ${BUILD_CONTEXT}/package-lock.json /api/

RUN npm install --progress=false

COPY . .

RUN npm run build

CMD npm run start:prod
