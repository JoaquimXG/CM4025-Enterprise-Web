FROM node:18-alpine AS build
# These environment variables are required during the build
ARG PUBLIC_HTTPS
ENV PUBLIC_HTTPS ${PUBLIC_HTTPS}
ARG PUBLIC_BACKEND_HOST
ENV PUBLIC_BACKEND_HOST ${PUBLIC_BACKEND_HOST}
ARG PUBLIC_BACKEND_PORT
ENV PUBLIC_BACKEND_PORT ${PUBLIC_BACKEND_PORT}
ARG PUBLIC_SAME_HOST
ENV PUBLIC_SAME_HOST ${PUBLIC_SAME_HOST}

# Create app directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn --frozen-lockfile

# Copy source code
COPY . .

# Build app
RUN yarn build

FROM nginx:1.23.3-alpine as static

# Clear existing nginx content
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*


# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Start nginx
CMD ["nginx", "-g", "daemon off;"]