# UMS

[![Build Status](https://travis-ci.org/alemarcha/UMS.svg?branch=master)](https://travis-ci.org/alemarcha/UMS)

User management system with MongoDB, Express and NodeJS app. Using Swagger for Docs Api.

## Installation with Docker

Firstable you need [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/) installed and MongoDB installed.
You can follow this links to [install docker on ubuntu 16-04es](https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es) and [install docker-compose on ubuntu 16-04](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04).

We are using docker-compose file _version 3.0_, so maybe you need to update to at least that version:

    curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

A `docker-compose.yml` looks like this:

    version: "3.5"
    services:
    server:
        build:
        context: .
        dockerfile: DockerfileServer
        volumes:
        - ./server:/app
        - /app/node_modules
        ports:
        - "3000:3000"
        command: "npm run build-pm2"

Using `docker-compose` (Use remote db or a local one in which we can share with other apps):

### Development

* remote_db

If do you want to connect to a existing remote mongo server, you should write down in your dotenv file:

    ENVIRONMENT=development_remote
    DB_development_remote=mongodb://{USER}:{PASSWORD}@{IP_DATABASE}:27017/database_ums

* local_db

Or in the contrary you already has a mongo running in your set up, then you should type the info like this:

    ENVIRONMENT=development_local
    DB_development_local=mongodb://{YOUR_IP_DATABASE}:{YOUR_PORT_DATABASE}/database_ums

In this case, you need to write down your local ip where your mongo is, if you just type localhost this will not work.

### Production

Same steps that we note before in the case of development, for the production you only need to change the development word for the production one.

We are storing the mongo data in when we use utils-docker/docker-shared-mongo(Deprecated) or utils-docker/docker-compose-internal:

      - ~/data/mongodb_data/:/data/db

If do you want to change this or the port used in order to connect with mongo, you can do this in the `docker-compose.yml` file.

## Config your .env file

1. Copy `.env-getting-started` and rename it to .env
2. Config your `.env` file

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
* Swagger Viewer (in order to preview the doc)
* pm2 for server monitoring

         npm install pm2@latest -g

## Execute test with Mocha, chai and Supertest

* cd UMS/server
* npm install
* npm run test-server
* You will see results of testing in command line

Moreover you could see our [travis CI](https://travis-ci.org/alemarcha/UMS)

## Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)

Rubén García Serrano (onitaku@gmail.com)
