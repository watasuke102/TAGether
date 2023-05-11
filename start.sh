#!/usr/bin/env bash
# if you use this under product environment, run "start.sh product"
set -e

failed=0
if [[ ! -e "$(dirname "$1")/front/env.json" ]]; then
  echo -e "\e[31m[FATAL] NOT FOUND: '/front/env.json'"
  failed=1
fi
if [[ ! -e "$(dirname "$1")/back/src/env.json" ]]; then
  echo -e "\e[31m[FATAL] NOT FOUND: '/back/env.json'"
  failed=1
fi
if [[ $failed -eq 1 ]]; then
  echo -e "        See 'README.md' to setup\e[m"
  exit 1
fi

echo -e "\e[32;7m[info] Started setup script (env: ${1:-not_product})\e[m"

## frontend setup
docker compose run --rm --entrypoint "npm install" front
echo -e "\e[36;7m[info] Frontend setup completed\e[m"

## backend setup
docker compose run --rm --entrypoint "npm install" back
echo -e "\e[36;7m[info] Backend setup completed\e[m"

## when product environment
if [[ ${1} == "product" ]]; then
  docker compose run --rm --entrypoint "npm run build" front
  ## start
  docker compose -f docker-compose.yml -f product.override.yml up -d --build
else
  ## when develop environment
  docker compose up -d --build
fi

echo -e "\e[36;7m[info] Setup was completed\e[m"
