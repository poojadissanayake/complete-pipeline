# Use a Node.js base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port app runs on
EXPOSE 3020

# Define the command to run the app
CMD ["npm", "start"]