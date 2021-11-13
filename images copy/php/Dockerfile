FROM php:7.4-fpm

WORKDIR "/application"

RUN apt-get update && apt-get --no-install-recommends install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \    
        php7.4-gd \ 
        php7.4-memcached \ 
        php7.4-mysql \ 
        php7.4-odbc \ 
        php7.4-pgsql \ 
        php7.4-redis \ 
        php7.4-soap \ 
        php7.4-xdebug \ 
        php7.4-xsl \ 
        php7.4-yaml; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*
    
COPY php-ini-overrides.ini /etc/php/7.4/fpm/conf.d/99-overrides.ini'