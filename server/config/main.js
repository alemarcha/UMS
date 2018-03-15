require("dotenv").config({ silent: true });

let loadVariablesByEnvironment = () => {
  let environmentVariables = {
    // Environment
    environment: process.env.ENVIRONMENT,
    //host
    host_swagger: process.env.HOST_SWAGGER || "localhost",
    //SALT_FACTOR for hash bcrypt password
    SALT_FACTOR: process.env.SALT_FACTOR || 5
  };
  switch (environmentVariables.environment) {
    case "test":
      return loadVariableTestEnvironment(environmentVariables);
      break;
    case "development":
      return loadVariableDevEnvironment(environmentVariables);
      break;
    case "production":
      return loadVariableProductionEnvironment(environmentVariables);
      break;
    default:
      return loadVariableProductionEnvironment(environmentVariables);
      break;
  }
};

let loadVariableTestEnvironment = environmentVariables => {
  // Database connection information
  environmentVariables.database = process.env.DB_TEST;
  // Setting port for server
  environmentVariables.port = process.env.PORT_TEST || 3030;
  // Secret key for JWT signing and encryption
  environmentVariables.secret = "My_Secret_KEY";

  return environmentVariables;
};
let loadVariableDevEnvironment = environmentVariables => {
  // Database connection information
  environmentVariables.database = process.env.DB_DEV;
  // Setting port for server
  environmentVariables.port = process.env.PORT_DEV || 3000;
  // Secret key for JWT signing and encryption
  environmentVariables.secret = process.env.SECRET_KEY_DEV || "My_Secret_KEY";

  return environmentVariables;
};

let loadVariableProductionEnvironment = environmentVariables => {
  // Database connection information
  environmentVariables.database = process.env.DB;
  // Setting port for server
  environmentVariables.port = process.env.PORT || 3000;
  // Secret key for JWT signing and encryption
  environmentVariables.secret = process.env.SECRET_KEY || "My_Secret_KEY";

  return environmentVariables;
};
module.exports = loadVariablesByEnvironment();
