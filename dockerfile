FROM php:8.2-apache

RUN docker-php-ext-install mysqli
RUN a2enmod rewrite

COPY public/ /var/www/html/
COPY config.php /var/www/html/
COPY styles.css /var/www/html/
COPY sunny.png /var/www/html/
COPY weather-background.jpg /var/www/html/
COPY weather-logo.png /var/www/html/
COPY script.js /var/www/html/
COPY forgot-password.html /var/www/html/
COPY signup.html /var/www/html/
COPY index.html /var/www/html/


ENV APACHE_DOCUMENT_ROOT /var/www/html

RUN sed -ri -e "s|/var/www/html|${APACHE_DOCUMENT_ROOT}|g" /etc/apache2/sites-available/*.conf

EXPOSE 80
