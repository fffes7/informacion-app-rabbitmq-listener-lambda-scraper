FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

#RUN npm config set registry http://192.168.0.210:8081/artifactory/api/npm/npm
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
CMD [ "npm","run", "start"]
