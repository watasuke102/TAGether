FROM php:fpm

WORKDIR /usr/share/nginx/html

RUN apt-get update && apt-get install -y git
COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
