FROM node:16.13.2-alpine

RUN mkdir /usr/pedidos

COPY . /usr/pedidos

WORKDIR  /usr/pedidos

EXPOSE 3000

#RUN npm install --global yarn

RUN yarn && \
    yarn react-scripts build && \
    yarn cache clean

CMD ["yarn", "react-scripts", "start"]
