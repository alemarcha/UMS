# UMS

MongoDB, Express and NodeJS app. Using Swagger for Docs Api.

# With Docker

Firstable you need Docker and docker-compose installed and MongoDB installed.
You can follow this links to install https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es and https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04

# Config your .env file

1. Copy .env-getting-started and rename it to .env
2. Config your .env file

After you have installed both:

1. git clone https://github.com/alemarcha/UMS.git
2. cd UMS
3. docker-compose up
4. You should see at localhost:3000 our swagger docs now.

# Without Docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1. git clone https://github.com/alemarcha/UMS.git
2. Install and init server.
3. cd UMS/server
4. npm install
5. npm build
6. You should see at localhost:3000 our swagger docs now.

# Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)
