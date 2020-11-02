FROM mhart/alpine-node:10

# Create app directory
WORKDIR /server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /server/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /server/

EXPOSE 5000
CMD [ "npm", "run", "server" ]

FROM mhart/alpine-node:10

# Create app directory
WORKDIR /client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /client/

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /client/

EXPOSE 3000
CMD ["npm", "start"]
