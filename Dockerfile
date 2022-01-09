# Alpine base
FROM node:16-alpine

# create app dir
WORKDIR /usr/src/app

# copy package.json & package.lock.json
COPY package*.json ./

# install dependencies
RUN npm ci 

# bundle src
COPY . .

# expose port
EXPOSE 5001

# start server
CMD npm start