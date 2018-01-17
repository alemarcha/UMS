module.exports.swagger_init = function (app, express) {
  const router = express.Router()
  const options = {
    swaggerDefinition: {
      info: {
        title: 'REST - Swagger Babelomics',
        version: '1.0.0',
        description: 'REST API with Swagger doc',
        contact: {
          email: 'babelomics@babelomics.es'
        }
      },
      tags: [
        {
          name: 'auth',
          description: 'Auth API'
        }
      ],
      schemes: ['http'],
      host: 'localhost:3000',
      basePath: '/api'
    },
    apis: ['./router.js']
  }

  const swaggerJSDoc = require('swagger-jsdoc')
  const swaggerUi = require('swagger-ui-express')
  const swaggerSpec = swaggerJSDoc(options)
  require('swagger-model-validator')(swaggerSpec)

  router.get('/json', function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  function validateModel (name, model) {
    const responseValidation = swaggerSpec.validateModel(name, model, false, true)
    if (!responseValidation.valid) {
      console.error(responseValidation.errors)
      throw new Error(`Model doesn't match Swagger contract`)
    }
  }

  app.use('/api/docs', router)
}