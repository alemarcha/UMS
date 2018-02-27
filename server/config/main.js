require("dotenv").config({ silent: true });

module.exports = {
  // Secret key for JWT signing and encryption
  secret: process.env.SECRET_KEY,

  // Environment
  environment: process.env.ENVIRONMENT,

  // Database connection information
  database: process.env["DB_" + process.env.ENVIRONMENT],

  //host
  host_swagger: process.env.HOST_SWAGGER || "localhost",

  // Setting port for server
  port: process.env.PORT || 3000,

  // SALT_FACTOR for hash bcrypt password
  SALT_FACTOR: process.env.SALT_FACTOR || 5,

  // Default user/password for testing
  email_default_test: process.env.EMAIL_TEST || "test",
  password_default_test: process.env.PASSWORD_TEST || "test",
  user_name_default_test: process.env.USER_TEST || "test",
  last_name_default_test: process.env.LAST_NAME_TEST || "test",

  // Activate
  isActive: process.env.isActive || false,

  // role
  role_test: process.env.ROLE_TEST || "ADMIN_TEST",
  role_testNew: process.env.ROLE_TEST_NEW || "ROLE_UPDATED",

  // permission
  permission_test: process.env.PERMISSION_TEST || "PERMISSION_TEST",
  permission_testNew: process.env.PERMISSION_TESTNEW || "PERMISSION_UPDATED"
};
