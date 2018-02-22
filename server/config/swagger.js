module.exports.swagger_init = function(app, express) {
  // const swaggerJSDoc = require('swagger-jsdoc')
  const YAML = require("yamljs");
  const config = require("./main");
  const swaggerUi = require("swagger-ui-express");
  const swaggerModelValidator = require("swagger-model-validator");

  const routerSwagger = express.Router();
  const options = YAML.load("./data/swagger/doc.yaml");
  options.host = config.host + ":" + config.port;
  // const swaggerDoc = swaggerJSDoc(options)
  // swaggerModelValidator(swaggerDoc)

  // router.get('/json', function (req, res) {
  //   res.setHeader('Content-Type', 'application/json')
  //   res.send(options)
  // })

  routerSwagger.use("/", swaggerUi.serve, swaggerUi.setup(options));

  // function validateModel (name, model) {
  //   const responseValidation = swaggerDoc.validateModel(name, model, false, true)
  //   if (!responseValidation.valid) {
  //     console.error(responseValidation.errors)
  //     throw new Error(`Model doesn't match Swagger contract`)
  //   }
  // }

  // Set auth routes as subgroup/middleware to /api/docs
  app.use("/api/docs", routerSwagger);
};
