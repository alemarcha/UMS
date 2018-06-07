# UMS https://alemarcha.github.io/UMS/

[![Build Status](https://travis-ci.org/alemarcha/UMS.svg?branch=master)](https://travis-ci.org/alemarcha/UMS)

User management system with MongoDB, Express and NodeJS app. Using Swagger for Docs Api.

## Installation with Docker

Firstable you need [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/) installed and internal or external MongoDB installed.
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

* To use a `remote_db`

If do you want to connect to a existing remote mongo server, you should write down in your dotenv file:

    ENVIRONMENT=development

And uncomment the following line:

    DB_DEV=mongodb://{USER}:{PASSWORD}@{IP_DATABASE}:27017/database_ums

* To use a `local_db`

Or in the contrary you already has a mongo running in your set up, then you should type the info like this:

    DB_DEV=mongodb://{YOUR_IP_DATABASE}:{YOUR_PORT_DATABASE}/database_ums

In this case, you need to write down your local ip where your mongo is, if you just type localhost this will not work.

### Production

Same steps that we note before in the case of development, for the production you only need to comment the development line and uncomment the production one.

We recommended created a new private and public keys for production environment instead of data/keys/jwt256.key and data/keys/jwt256.key.pub we have in our repo with development and testing purposes. You can create your keys following:

    ssh-keygen -t rsa -b 4096 -f jwtRS256.key
    #Without passphrase
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
    cat jwtRS256.key
    cat jwtRS256.key.pub

You can put wherever you want and put the path in your .env file to work with them. You never must publish your private key. You just should share your public key instead of private.

JWT_PRIVATE_KEY_PATH=data/keys/jwtRS256.key
JWT_PUBLIC_KEY_PATH=data/keys/jwtRS256.key.pub

### Load balancing mode

Load balancing across multiple application instances is a commonly used technique for optimizing resource utilization, maximizing throughput, reducing latency, and ensuring fault-tolerant configurations.

It is possible to use nginx as a very efficient HTTP load balancer to distribute traffic to several application servers and to improve performance, scalability and reliability of web applications with nginx.

We use round-robin method.

If we want to deploy more than one instance and use load balancing we need to execute following command:

         docker-compose up --scale server_1=num_of_instances_you_want

instead of docker just

         docker-compose up

which just will deploy one instance

### Testing

In order to do our tests this will be the mongodb route in local:

    DB_TEST=mongodb://localhost:27017/ums_test

### Data storage

We are storing the mongo data in when we use utils-docker/docker-shared-mongo(Deprecated) or utils-docker/docker-compose-internal:

      - ~/data/mongodb_data/:/data/db

If do you want to change this or the port used in order to connect with mongo, you can do this in the `docker-compose.yml` file.

## Config your .env file

1.  Copy `.env-getting-started` and rename it to .env
2.  Config your `.env` file

After you have installed both:

1.  git clone <https://github.com/alemarcha/UMS.git>
2.  cd UMS
3.  docker-compose up
4.  You should see at localhost:8082 our swagger docs now.

## Getting started without Docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1.  git clone <https://github.com/alemarcha/UMS.git>
2.  Install and init server.
    * cd UMS/server
    * npm install
    * npm start

You should see at localhost:8082 our Swagger docs now.

## Info for development

We are using Visual Studio Code to programming, if you are planning to replicate the way we are doing it, we recommend you to install the following extensions:

`Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.`

* Docker

> ext install PeterJausovec.vscode-docker

* ESLint

> ext install dbaeumer.vscode-eslint

* Prettier - Code formatter

> ext install esbenp.prettier-vscode

* YAML support for vscode

> ext install redhat.vscode-yaml

* Swagger Viewer (in order to preview the doc)

> ext install Arjun.swagger-viewer

* Install pm2 with npm for server monitoring

         npm install pm2@latest -g

## Execute test with Mocha, chai and Supertest

* cd UMS/server
* npm install
* npm run test

You will see results of testing in command line

## Stress test http with hey

cd ~/go/bin/
./hey -n 5000 -c 500 http://localhost:8082/api/users/search

### Moreover you could see our [travis CI](https://travis-ci.org/alemarcha/UMS)

## Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)

Rubén García Serrano (onitaku@gmail.com)
