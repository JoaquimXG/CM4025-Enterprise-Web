#!/bin/bash

# This script is used to launch the application

# Enforce running with sudo only
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Initialise environment variables
cat .env.example >.env

# read -p "Enter a MySQL root password: " MYSQL_ROOT_PASSWORD
# read -p "Enter a MySQL standard password: " MYSQL_PASSWORD
# read -p "Enter a session secret: " SESSION_SECRET
# read -p "Enter CORS origin (host where app will be hosted, including protocol, e.g., https://joaquimgomez.com): " CORS_ORIGIN

MYSQL_PASSWORD=woo
MYSQL_ROOT_PASSWORD=woo2
SESSION_SECRET=woo3
CORS_ORIGIN=https://cm4025.local.joaquimgomez.com

sed -i "s/{##MYSQL_ROOT_PASSWORD##}/$MYSQL_ROOT_PASSWORD/g" .env
sed -i "s/{##MYSQL_PASSWORD##}/$MYSQL_PASSWORD/g" .env
sed -i "s/{##SESSION_SECRET##}/$SESSION_SECRET/g" .env
sed -i "s/{##CORS_ORIGIN##}/$CORS_ORIGIN/g" .env

./get-docker.sh


# Start database container
docker-compose up -d db
# Run migrations on first launch, then remove container
docker-compose run --rm --entrypoint /bin/sh/ backend -c "yarn migrate"
# Start all containers
docker-compose up -d