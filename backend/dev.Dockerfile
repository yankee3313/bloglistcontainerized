FROM node:16

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY --chown=node:node . .

USER node

CMD ["npm", "run", "dev"]