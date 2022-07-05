FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .
RUN npm install

# Use source code
COPY . .

EXPOSE 3000

# Start Development Server
CMD [ "npm","run","start:dev" ]
