FROM node:10.16.0-alpine

WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN yarn global add sequelize sequelize-cli pg

RUN yarn install
COPY . /usr/src/app

EXPOSE 8080

RUN cd /usr/src/app

CMD [ "yarn", "start" ]