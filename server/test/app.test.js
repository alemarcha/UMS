process.env.ENVIRONMENT = "test";
let mongoose = require("mongoose");
let app = require("../server.js");
let config = require("../config/main");
let request = require("supertest")(app);
let assert = require("assert");

//clean collections
before(function(done) {
  function clearCollections() {
    for (var collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].drop(function() {});
      console.log(collection);
    }
    return done();
  }
  return clearCollections();
});

//found 302
describe("GET /", function() {
  it("should render REST - Swagger Babelomics", function(done) {
    request
      .get("/")
      .expect(302)
      .end(done);
  });
});

//API OK
describe("GET /api/ping", function() {
  it("should render ok", function(done) {
    request
      .get("/api/ping")
      .expect(200)
      .expect({
        ok: true
      })
      .end(done);
  });
});

//User Register OK
describe("POST correct role /api/users/register", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test,
        password: config.password_default_test,
        firstName: config.user_name_default_test,
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.user.email, "jack@email.com");
      })
      .expect(201, done);
  });
});

//User log-in OK
describe("POST correct user /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test,
        password: config.password_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

// 401 Unauthorized
describe("POST incorrrect user /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test,
        password: config.password_default_test + "_fake"
      })
      .expect(401, done);
  });
});

// Create Role OK
describe("POST correct role /api/roles/create", function() {
  it("should render ok", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});
