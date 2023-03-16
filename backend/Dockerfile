# Node 18 required for Structured Clone
FROM node:18-alpine
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install app dependencies
COPY yarn.lock package.json ./
RUN yarn --frozen-lockfile

# Bundle app source
COPY . .

# Start app
ENTRYPOINT [ "/bin/sh", "-c", "/app/entrypoint.sh" ]