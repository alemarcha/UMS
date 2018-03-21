const express = require("express"),
  logger = require("morgan"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  config = require("./config/main");

global.__basedir = __dirname + "/";
const router = require("./router");
const app = express();
app.use(require("express-status-monitor")());
// Init swagger
require("./config/swagger").swagger_init(app, express);
console.log("Swagger Init");

// Database Connection
mongoose.connect(config.database, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

// Start the server
const server = app.listen(config.port);
console.log(
  "Your server is running on port " +
    config.port +
    ". Environment " +
    config.environment
);

// Setting up basic middleware for all Express requests
// Log requests to API using morgan
app.use(logger("dev"));

// Parse urlencoded bodies to JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home route. Redirect to swagger docs
app.get("/", function(req, res) {
  res.redirect("api/docs");
  // res.send('Relax. We will put the home page here later.');
});

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router(app);

module.exports = app;
