### STAGE 1: Get node modules
FROM node:22 AS deps

WORKDIR /app

COPY package.json ./package-lock.json ./

RUN npm ci

# STAGE 2: Build the angular dashboard
FROM node:22 AS builder

WORKDIR /ng-app

COPY --from=deps /app/node_modules ./node_modules

COPY  . /ng-app

RUN npm run ng build


### STAGE 3: Serve
FROM nginx:alpine

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/www/browser /usr/share/nginx/html
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

