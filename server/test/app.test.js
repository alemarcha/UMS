let app = require("../server.js");
let config = require("../config/main");
let request = require("supertest")(app);
let assert = require("assert");

describe("GET /", function() {
  it("should render REST - Swagger Babelomics", function(done) {
    request
      .get("/")
      .expect(302)
      .end(done);
  });
});

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

describe("POST correct user /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.user_default_test,
        password: config.password_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

describe("POST incorrrect user /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.user_default_test,
        password: config.password_default_test + "_fake"
      })
      .expect(401, done);
  });
});
