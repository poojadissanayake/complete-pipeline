# Use a Node.js base image
FROM node:20.3.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install SonarQube Scanner globally
RUN npm install -g sonar-scanner

# Copy the rest of the project files
COPY . .

# Expose the port app runs on
EXPOSE 3020

# Define the command to run the app
CMD ["npm", "start"]