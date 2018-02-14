# MERN

MongoDB, Express, ReactJS and NodeJS app. Using Swagger for Docs Api.

# With Docker

Firstable you need Docker and docker-compose installed and MongoDB installed.
You can follow this links to install https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es and https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04

#Config your .env file

1. Copy .env-getting-started and rename it to .env
2. Config your .env file

After you have installed both:

1. git clone https://github.com/alemarcha/MERN.git
2. cd MERN
3. docker-compose up
4. You should see at localhost:3000 our swagger docs now.
5. You should see at localhost:8081 our app in ReacJS and login using test/test by default

# Without Docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1. git clone https://github.com/alemarcha/MERN.git
2. Install and init server.
3. cd MERN/server
4. npm install
5. npm build
6. You should see at localhost:3000 our swagger docs now.
7. Install and init client
8. cd MERN/client
9. npm install
10. npm dev
11. After npm start it should open a browser screen in localhost:8081 with app in ReacJS.

# Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)
