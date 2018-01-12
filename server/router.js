const AuthenticationController = require('./controllers/authentication'),  
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });  

// Constants for role types
const REQUIRE_ADMIN = "Admin",  
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";

module.exports = function(app) {  
    // Initializing route groups
    const apiRoutes = express.Router(),
          authRoutes = express.Router();

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    apiRoutes.get('/users', function(req, res) {  res.status(200).json({
        ok: true,
        users: [{id: "1",firstName: "nombre", lastName: "lastName"}]
    }
    );
  });

  apiRoutes.get('/prueba', function(req, res) {  res.status(200).json({
    ok: true
}
);
});
    // Private routes
    apiRoutes.get('/protected', requireAuth,  function(req, res, next) {  res.status(200).json({
           content: "Respuesta desde api protected"
      });
    });
      // Set url for API group routes
    app.use('/api', apiRoutes);
   

};