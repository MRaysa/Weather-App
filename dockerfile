FROM php:8.2-apache

# Install necessary packages
# RUN apt-get update && apt-get install -y \
#     software-properties-common \
#     && add-apt-repository ppa:ondrej/php -y \
#     && apt-get update && apt-get install -y libapache2-mod-php \
#     && rm -rf /var/lib/apt/lists/*

    

# Set ServerName to suppress the warning
RUN echo "ServerName localhost" | tee -a /etc/apache2/apache2.conf

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Enable required Apache modules
RUN a2enmod rewrite

# Restart Apache (this line is usually handled by CMD)
CMD ["apache2-foreground"]

