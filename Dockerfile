# syntax=docker/dockerfile:1

# ---- Stage 1: build the React frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Same-origin in production — API and SPA are served from the same domain,
# so these are relative paths, not absolute URLs.
ENV VITE_API_URL=/api
ENV VITE_APP_URL=

RUN npm run build

# ---- Stage 2: PHP + Apache serving the Laravel API and the built SPA ----
FROM php:8.2-apache AS backend

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        unzip \
        git \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# The base image ships with no active php.ini, so uploads fall back to PHP's
# tiny compiled-in defaults (upload_max_filesize=2M, post_max_size=8M) — well
# under what a phone photo needs, and under that ceiling PHP silently drops
# the whole request body, wiping $_POST along with the files. Raise both past
# the app's own 10MB-per-image validation limit (StoreProjectRequest etc.),
# with headroom for a thumbnail plus several gallery images in one request.
RUN { \
        echo 'upload_max_filesize=12M'; \
        echo 'post_max_size=60M'; \
        echo 'max_file_uploads=20'; \
    } > /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html

COPY backend/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Built frontend assets become Laravel's public webroot alongside index.php
COPY --from=frontend-build /frontend/dist/ ./public/

RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
