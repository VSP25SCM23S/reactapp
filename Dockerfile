# React Dev Server in Cloud Run (for development only)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY ./public ./public
COPY ./src ./src
RUN npm install

# Expose port 80 (Cloud Run uses this)
EXPOSE 80

# Start React dev server on port 80
CMD ["npm", "start", "--", "--port", "80", "--host", "0.0.0.0"]
