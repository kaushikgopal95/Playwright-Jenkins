# Use an official Node.js runtime as base image
FROM node:lts-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Your app binds to port 3000
EXPOSE 3000

# Define the command to run your app
CMD ["node", "/usr/src/app/src/index.js"]