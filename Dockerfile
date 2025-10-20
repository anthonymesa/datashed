# Stage 1: Build the React application
FROM node:21 as build

WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./
# or if using yarn:
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# or if using yarn:
# RUN yarn install

# Copy the rest of the project files
COPY .env.production ./
COPY . .

# Build the project
RUN npm run build:production
# or if using yarn:
# RUN yarn build

# Stage 2: Serve the build with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build ./app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
