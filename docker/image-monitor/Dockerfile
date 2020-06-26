FROM node:14.4

COPY . /opt/app/
WORKDIR /opt/app/

RUN yarn install
RUN yarn build

RUN npm install -g serve

ENTRYPOINT [ "serve" ]
CMD [ "-s", "build" ]