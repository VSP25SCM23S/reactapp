# Stage 1: Build React App
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Replace default Nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Cloud Run
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
