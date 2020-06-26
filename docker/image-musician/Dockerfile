FROM node:14.4

COPY . /opt/app/

WORKDIR /opt/app/

RUN yarn install

ENTRYPOINT ["node", "/opt/app/src/app.js"]
