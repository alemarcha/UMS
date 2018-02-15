# UMS

User management system with MongoDB, Express and NodeJS app. Using Swagger for Docs Api.

## Installation with Docker

Firstable you need [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/) installed and MongoDB installed.
You can follow this links to install <https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es> and <https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04>

We are using docker-compose file _version 3.0_, so maybe you need to update to at least that version:

    curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

A `docker-compose.yml` looks like this:

    version: '3'
    services:
    web:
        build: .
        ports:
        - "5000:5000"
        volumes:
        - .:/code
        - logvolume01:/var/log
        links:
        - redis
    redis:
        image: redis
    volumes:
    logvolume01: {}

We are storing the mongo data in:

      - ~/data/mongodb_data/:/data/db

If do you want to change this or the port used in order to connect with mongo, you can do this in the `docker-compose.yml` file.

## Config your .env file

1. Copy .env-getting-started and rename it to .env
2. Config your .env file

After you have installed both:

1. git clone <https://github.com/alemarcha/UMS.git>
2. cd UMS
3. docker-compose up
4. You should see at localhost:3000 our swagger docs now.

## Getting started without Docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1. git clone <https://github.com/alemarcha/UMS.git>
2. Install and init server.
   * cd UMS/server
   * npm install
   * npm start

You should see at localhost:3000 our Swagger docs now.

## Info for development

We are using vscode to program, we recommend you to install the following extensions:

* Docker
* ESLint
* Prettier - Code formatter
* YAML support for vscode

## Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)

Rubén García Serrano (onitaku@gmail.com)
