FROM mhart/alpine-node:10 as node

# Create app directory
WORKDIR /client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /client/

RUN yarn global add react-scripts
RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /client/

EXPOSE 3000
CMD ["npm", "start"]
