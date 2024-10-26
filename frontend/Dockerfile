# Build stage
FROM node:20-slim AS build

# Add build arguments
ARG REACT_APP_BASE_URL
ARG gemini_key
ARG PERSONAL_ACCESS_TOKEN_GITHUB

# Set environment variables
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV gemini_key=$gemini_key
ENV PERSONAL_ACCESS_TOKEN_GITHUB=$PERSONAL_ACCESS_TOKEN_GITHUB

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Log environment variables for debugging during build
RUN echo "Building with REACT_APP_BASE_URL=$REACT_APP_BASE_URL"

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install bash and curl for debugging if needed
RUN apk add --no-cache bash curl

# Copy the build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Create a runtime environment script
RUN echo "window._env_ = {};" > /usr/share/nginx/html/env-config.js

# Create entrypoint script with improved error handling
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Create env-config.js with environment variables' >> /entrypoint.sh && \
    echo 'cat <<EOF > /usr/share/nginx/html/env-config.js' >> /entrypoint.sh && \
    echo 'window._env_ = {' >> /entrypoint.sh && \
    echo '  REACT_APP_BASE_URL: "${REACT_APP_BASE_URL:-\"http://localhost:8080\"},"' >> /entrypoint.sh && \
    echo '  gemini_key: "${gemini_key:-\"\"},"' >> /entrypoint.sh && \
    echo '  PERSONAL_ACCESS_TOKEN_GITHUB: "${PERSONAL_ACCESS_TOKEN_GITHUB:-\"\"}"' >> /entrypoint.sh && \
    echo '};' >> /entrypoint.sh && \
    echo 'EOF' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Verify nginx config' >> /entrypoint.sh && \
    echo 'nginx -t' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start nginx' >> /entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]