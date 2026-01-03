# Use Node.js 20 as base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend files
COPY . .

# Expose the port your backend runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
