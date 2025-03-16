# Use the official Node.js image
FROM node:18-alpine

# Install http-server globally
RUN npm install -g http-server

# Set the working directory
WORKDIR /app

# Copy your static files (HTML, CSS, JS)
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the HTTP server
CMD ["http-server", "-p", "8080"]