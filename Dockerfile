FROM nginx

RUN mkdir -p /var/www/html \
    && rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/www /var/www/html/
