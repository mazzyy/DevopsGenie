# Use the official Node.js image from the Docker Hub
FROM node:20-slim

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
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
