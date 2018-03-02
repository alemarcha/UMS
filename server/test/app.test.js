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
describe("POST correct user /api/users/register", function() {
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

//User Register created to Update OK
describe("POST correct user /api/users/register", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: config.password_default_test2,
        firstName: config.user_name_default_test,
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.user.email, config.email_default_test2);
      })
      .expect(201, done);
  });
});

//User updated user duplicate email OK
describe(
  "PUT Update incorrect user /api/users/" +
    config.email_default_test2 +
    "/update",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/update")
        .set("Content-Type", "application/json")
        .send({
          email: config.email_default_test,
          firstName: config.user_name_default_test,
          lastName: config.last_name_default_test
        })
        .expect(function(res) {
          assert.equal(res.body.ok, false);
        })
        .expect(409, done);
    });
  }
);

//User updated OK
describe(
  "PUT Update correct user /api/users/" +
    config.email_default_test2 +
    "/update",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/update")
        .set("Content-Type", "application/json")
        .send({
          email: config.email_default_test3,
          firstName: config.user_name_default_test,
          lastName: config.last_name_default_test
        })
        .expect(function(res) {
          assert.equal(res.body.ok, true);
          assert.equal(res.body.user.email, config.email_default_test3);
          assert.equal(res.body.user.firstName, config.user_name_default_test);
          assert.equal(res.body.user.lastName, config.last_name_default_test);
        })
        .expect(200, done);
    });
  }
);

// Delete User
describe("Disable user.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/users/" + config.email_default_test + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

//User log-in OK
describe("Log-in user in the system /api/users/login", function() {
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
describe("Try to access with incorrect password.", function() {
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
describe("Try to access with incorrect email.", function() {
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
describe("Create a new role.", function() {
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
describe("Update role /api/roles/:role/update", function() {
  it("should render ok", function(done) {
    request
      .put("/api/roles/" + config.role_test + "/update")
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

// Delete Role
describe("Disable role.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/roles/" + config.role_test + "/update")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

// Create permission OK
describe("Create a new permission.", function() {
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
describe("Update a permission", function() {
  it("should render ok", function(done) {
    request
      .put("/api/permissions/" + config.permission_test + "/update")
      .set("Content-Type", "application/json")
      .send({
        newPermissionName: config.permission_testNew,
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(
          res.body.permissions.permissionName,
          config.permission_testNew
        );
      })
      .expect(200, done);
  });
});

// Delete Permission
describe("Disable permission.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/permissions/" + config.permission_testNew + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
      })
      .expect(200, done);
  });
});

// Create role in order to check duplicity
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

// Update a role that already exists
describe("Update a role with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .put("/api/roles/" + config.role_test2 + "/update")
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

// Create permission in order to check duplicity
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

// Update a permission that already exists
describe("Update a permission with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .put("/api/permissions/" + config.permission_test2 + "/update")
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
