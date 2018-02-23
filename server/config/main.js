const Dotenv = require("dotenv");

Dotenv.config({ silent: true });

module.exports = {
  // Secret key for JWT signing and encryption
  secret: process.env.SECRET_KEY,
  // Enviroment
  enviroment: process.env.ENVIROMENT,
  // Database connection information
  database: process.env["DB_" + process.env.ENVIROMENT],
  //host
  host_swagger: process.env.HOST_SWAGGER || "localhost",
  // Setting port for server
  port: process.env.PORT || 3000,
  // SALT_FACTOR for hash bcrypt password
  SALT_FACTOR: process.env.SALT_FACTOR || 5,
  // Default user/password for testing
  user_default_test: process.env.USER_TEST || test,
  password_default_test: process.env.PASSWORD_TEST || test,
  role_test: process.env.ROLE_TEST || ADMIN_TEST
};
