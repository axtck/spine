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

# expose port passed in as arg, default to 5001
ARG PORT=5001
EXPOSE $PORT

# start server
CMD npm start