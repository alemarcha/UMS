const Dotenv = require("dotenv");

Dotenv.config({ silent: true });

module.exports = {
  // Secret key for JWT signing and encryption
  secret: process.env.SECRET_KEY,
  // Database connection information
  database: process.env.DB,
  // Setting port for server
  port: process.env.PORT || 3000,
  // SALT_FACTOR for hash bcrypt password
  SALT_FACTOR: process.env.SALT_FACTOR || 5
};
