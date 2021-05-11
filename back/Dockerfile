FROM php:fpm

WORKDIR /usr/share/nginx/html

RUN apt update && apt install -y git

#COPY php.ini /usr/local/etc/php/conf.d/php.ini
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY . .

# composer cannot run as root
RUN useradd -m composer
RUN chown composer /usr/share/nginx/html
USER composer
RUN composer install
