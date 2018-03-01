process.env.ENVIRONMENT = "test";

let mongoose = require("mongoose");
let app = require("../server.js");
let config = require("./test_variables.js");
let request = require("supertest")(app);
let assert = require("chai").assert;

//clean collections
before(function(done) {
  function clearCollections() {
    for (var collection in mongoose.connection.collections) {
      mongoose.connection.dropCollection(collection, function(err, result) {});
    }
    return done();
  }
  return clearCollections();
});

//run once after all tests
// after(function(done) {
//   if (true) {
//     console.log("Deleting test database");
//     mongoose.connection.db.dropDatabase(done);
//   } else {
//     console.log(
//       "Not deleting test database because it already existed before run"
//     );
//     done();
//   }
// });

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
describe("GET /api/ping response", function() {
  it("should render 200 ok", function(done) {
    request
      .get("/api/ping")
      .expect(200)
      .expect({
        ok: true
      })
      .end(done);
  });
});

//User Register created OK
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
        assert.equal(res.body.user.email, config.email_default_test);
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
        assert.exists(res.body.token);
      })
      .expect(200, done);
  });
});

// 401 Unauthorized password
describe("POST incorrrect password /api/users/login", function() {
  it("should give an error 401, unauthorized", function(done) {
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

// 401 Unauthorized user
describe("POST incorrrect user /api/users/login", function() {
  it("should give an error 401, unauthorized", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test + "_fake",
        password: config.password_default_test
      })
      .expect(401, done);
  });
});

// Create Role OK
describe("POST correct role /api/roles/create", function() {
  it("should render created 201", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.role.roleName, config.role_test);
      })
      .expect(201, done);
  });
});

// Update Role OK
describe("PUT correct role /api/roles/update", function() {
  it("should render ok", function(done) {
    request
      .put("/api/roles/update")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test,
        newRoleName: config.role_testNew,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

// Create permission OK
describe("POST correct permission /api/permissions/create", function() {
  it("should render created 201 code", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(
          res.body.permission.permissionName,
          config.permission_test
        );
      })
      .expect(201, done);
  });
});

// Update Permission OK
describe("PUT correct permission /api/permissions/update", function() {
  it("should render ok", function(done) {
    request
      .put("/api/permissions/update")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test,
        newPermissionName: config.permission_testNew,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

//************* In order to check duplicity *************//

// Create Role OK
describe("Create another role", function() {
  it("should render ok", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.role.roleName, config.role_test2);
      })
      .expect(201, done);
  });
});

// Update Role exists
describe("Update a role with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .put("/api/roles/update")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test2,
        newRoleName: config.role_testNew2,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(409, done);
  });
});

// Create permission
describe("Create another permission", function() {
  it("should render ok", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(
          res.body.permission.permissionName,
          config.permission_test2
        );
      })
      .expect(201, done);
  });
});

// Update Permission
describe("Update a permission with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .put("/api/permissions/update")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test2,
        newPermissionName: config.permission_testNew2,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(409, done);
  });
});
//************* /// In order to check duplicity -end *************//
