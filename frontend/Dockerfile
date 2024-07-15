# Use the official Node.js image from the Docker Hub
FROM node:20-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container at /app
COPY package*.json ./

# Install any dependencies specified in package.json
RUN npm install

# Copy the rest of the application code into the container at /app
COPY . .

# Build the React app for production
RUN npm run build

# Use a different base image for serving the app
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
