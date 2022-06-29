FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Install app dependencies
COPY package.json .
RUN npm install

# Use source code
COPY . .

EXPOSE 4200

# Start Development Server
CMD [ "ng","serve","--host", "0.0.0.0" ]
