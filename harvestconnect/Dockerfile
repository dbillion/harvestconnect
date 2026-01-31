# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Install necessary build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps to handle conflicts
RUN npm install --legacy-peer-deps

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the application in development mode (since build fails with webpack config)
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]