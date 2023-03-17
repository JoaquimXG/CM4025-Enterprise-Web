#!/bin/bash

# This script is used to launch the application

# Enforce running with sudo only
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Source environment variables
source .env

# Install NGINX
apt-get update
apt-get install -y nginx

# Install Docker
./get-docker.sh

# Login to ghcr
echo $GHCR_TOKEN | docker login ghcr.io -u $GHCR_USERNAME --password-stdin

# Start database container
docker compose up -d db
# Run migrations on first launch, then remove container
docker compose run --rm --entrypoint /bin/sh backend -c "yarn migrate"
# Start all containers
docker compose up -d

# Copy nginx config to /etc/nginx/sites-enabled/default
cp nginx_app.conf /etc/nginx/sites-enabled/default

# Copy SSL certs
mkdir /etc/nginx/ssl
cp cert/fullchain.pem /etc/nginx/ssl/fullchain.pem
cp cert/privkey.pem /etc/nginx/ssl/privkey.pem


# Restart nginx
systemctl restart nginx
# enable nginx on startup
systemctl enable nginx

# Containers have restart: always, so they will restart on reboot