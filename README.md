# Quote Builder App CM4025

## Table of Contents

- [Quote Builder App CM4025](#quote-builder-app-cm4025)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Example](#example)
  - [Usage](#usage)
    - [Overview](#overview-1)
    - [Setup](#setup)
    - [Deployment](#deployment)
    - [Auto Deployment](#auto-deployment)

## Overview

A simple quote builder application. Application functionality is fairly simple
as described by coursework requirements. The interesting aspect of this project
being that it includes a MVP implementation of the Django Rest Framework in
JavaScript.

## Example

An example instance is provided showing an optimial deployment of the app
[here](https://cm4025.joaquimgomez.com).

This example is deployed using terraform and ansible, using container images
which are auto-built and published using GitHub actions.

The example includes settings which are unfeasible for the submission deployment, e.g. 

- SSL certificate for cm4025.joaquimgomez.com
- Secure cookies
- CORS restricted to a single domain, cm4025.joaquimgomez.com
- HTTP requests are redirected to HTTPS

## Usage

### Overview

Depoloyment is managed via docker/docker-compose with three services, frontend,
backend and database.

Frontend and backend services are built and published when merging with the
master branch in GitHub via github actions.  A docker-compose file in
cicd/auto_deploy/ is used to deploy the three services on an application
instance.

Nginx is used in front of each container to proxy requests to the correct
service, e.g., /api/XXX is proxied to the backend service while all other
requests are proxied to the frontend service. Additionally nginx is used for
SSL termination.

### Setup

Three components are required for a full deployment:

1. The scripts, docker-compose file and nginx config in cicd/auto_deploy/
  - launch.sh installs nginx, docker/docker-compose, positions the certificate
    and nginx conf files before running migrations and starting services
  - get-docker.sh is used to install docker/docker-compose
2. SSL certificate and private key for cm4025.joaquimgomez.com
  - These are not committed to github as they are private, they will be
    provided separately, they should be in a folder called cert in the same
    directory as launch.sh
3. a .env file which includes settings for both frontend and backend.
  - These are also not committed to github as they include secrets/passwords.
    This file will also be provided separately. It should be included in the
    same directory as launch.sh

Note these three components will be provided in a single zip file for the
submission.

### Deployment

1. Prepare deployment folder as discussed above, for the submission just place the submitted folder somewhere on the target instance. I would suggest using /opt/cm4025 or similar as the root folder.
2. Run launch.sh as root, this will install docker/docker-compose, nginx, run migrations and start the services
3. You should now be able to view the app at localhost:80 and localhost:443, though you will get an SSL error as the certificate is setup for cm4025.joaquimgomez.com

launch.sh should only be run one time as it will run destructive migrations. NGINX and containers will be configured by launch.sh to restart on boot.


### Auto Deployment

This is not for the submission, just for my notes.

1. Launch instance with terraform
  - cd cicd/tf/deployments/app-instance/ && terraform apply -var-file=../environments/prod.tfvars
  - may need to run again to set correct IP for route53
2. Update inventory file with instance IP
3. Uncomment lines in cicd/auto_deploy/nginx_app.conf for HTTPS redirect
2. Run ansible playbook
  - cd cicd/ansible && ansible-playbook -i inventory.yml auto-deploy.yml
