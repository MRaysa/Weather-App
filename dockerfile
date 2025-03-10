FROM php:8.2.27-apache

# Install necessary extensions for MySQL
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Set ServerName to suppress warnings
RUN echo "ServerName localhost" | tee -a /etc/apache2/apache2.conf

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Enable required Apache modules
RUN a2enmod rewrite

# Restart Apache (this is handled by CMD)
CMD ["apache2-foreground"]
