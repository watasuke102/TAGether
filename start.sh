#!/usr/bin/env bash
# if you use this under product environment, run "start.sh product"
set -e

echo -e "\e[32;7m[info] Started setup script (env: ${1:-not_product})\e[m"

## frontend setup
docker compose run --rm --entrypoint "npm install" front
echo -e "\e[36;7m[info] Frontend setup completed\e[m"

## when product environment
if [[ ${1} == "product" ]]; then
  docker compose run --rm --entrypoint "npm run build" front
  ## start
  docker compose -f compose.yaml -f product.override.yml up -d --build
else
  ## when develop environment
  docker compose up -d --build
fi

echo -e "\e[36;7m[info] Setup was completed\e[m"
