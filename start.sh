#!/usr/bin/env bash
# if you use this under product environment, run "start.sh product"
set -eu

git pull

## frontend setup
docker-compose run --rm --entrypoint "npm install" front

## backend setup
docker-compose run --rm --entrypoint "composer install" back

## when product environment
if [[ ${1} == "product" ]]; then
  docker-compose run --rm --entrypoint "npm run build" front
  ## start
  docker-compose -f docker-compose.yml -f product.override.yml up -d --build
else
  ## when develop environment
  docker-compose -d --build
fi
