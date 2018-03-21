require("dotenv").config({ silent: true });

let loadVariablesByEnvironment = () => {
  let environmentVariables = {
    // Environment
    environment: process.env.ENVIRONMENT,
    //host
    host_swagger: process.env.HOST_SWAGGER || "localhost",
    //SALT_FACTOR for hash bcrypt password
    SALT_FACTOR: process.env.SALT_FACTOR || 5,
    jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
    jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH,
    signOptionsJwt: {
      issuer: process.env.JWT_ISSUER || "UMS",
      subject: process.env.JWT_SUBJECT || "alexis.martinez@juntadeandalucia.es",
      audience: process.env.JWT_AUDIENCE || "UMS.com",
      expiresIn: process.env.JWT_EXPIRES || "24h",
      algorithm: "RS256"
    }
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

  return environmentVariables;
};
let loadVariableDevEnvironment = environmentVariables => {
  // Database connection information
  environmentVariables.database = process.env.DB_DEV;
  // Setting port for server
  environmentVariables.port = process.env.PORT_DEV || 3000;

  return environmentVariables;
};

let loadVariableProductionEnvironment = environmentVariables => {
  // Database connection information
  environmentVariables.database = process.env.DB;
  // Setting port for server
  environmentVariables.port = process.env.PORT || 3000;

  return environmentVariables;
};
module.exports = loadVariablesByEnvironment();
