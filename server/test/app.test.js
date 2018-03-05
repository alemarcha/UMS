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
describe("(0.0), GET /", function() {
  it("should render REST - Swagger Babelomics", function(done) {
    request
      .get("/")
      .expect(302)
      .end(done);
  });
});

//API OK
describe("(0.1), GET /api/ping response", function() {
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
describe("(1.0), POST User Register created OK", function() {
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
        assert.equal(res.body.data.user.email, config.email_default_test);
      })
      .expect(201, done);
  });
});

//User Register duplicated
describe("(1.1), POST User Register duplicated", function() {
  it("should fail, expected a 409 code", function(done) {
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
        assert.equal(res.body.ok, false);
      })
      .expect(409, done);
  });
});
//User Register created to Update OK
describe("(1.2), POST User Register created to Update OK", function() {
  it("should give a 201 code, created", function(done) {
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
        assert.equal(res.body.data.user.email, config.email_default_test2);
      })
      .expect(201, done);
  });
});

//User Register error email empty
describe("(1.3), POST User Register error email empty", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: "",
        password: config.password_default_test2,
        firstName: config.user_name_default_test,
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

//User Register error firstName empty
describe("(1.4), POST User Register error firstName empty", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: config.password_default_test2,
        firstName: "",
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

//User Register error lastname empty
describe("(1.5), POST User Register error lastname empty", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: config.password_default_test2,
        firstName: config.user_name_default_test,
        lastName: ""
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

//User Register error password empty
describe("(1.6), POST User Register error password empty", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: "",
        firstName: config.user_name_default_test,
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

//User updated user duplicate email OK
describe(
  "(1.7), PUT Update incorrect user /api/users/" +
    config.email_default_test2 +
    "/update",
  function() {
    it("should fail, expected a 409 code", function(done) {
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
  "(1.8), PUT Update correct user /api/users/" +
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
          assert.equal(res.body.data.user.email, config.email_default_test3);
          assert.equal(
            res.body.data.user.firstName,
            config.user_name_default_test
          );
          assert.equal(
            res.body.data.user.lastName,
            config.last_name_default_test
          );
        })
        .expect(200, done);
    });
  }
);

// Delete User
describe("(1.9), Disable user.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/users/" + config.email_default_test + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.data.user.isActive, false);
      })
      .expect(200, done);
  });
});

//User log-in OK
describe("(1.10), Log-in user in the system /api/users/login", function() {
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
        assert.exists(res.body.data.token);
      })
      .expect(200, done);
  });
});

// 401 Unauthorized password
describe("(1.11), Try to access with incorrect password.", function() {
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
describe("(1.12), Try to access with incorrect email.", function() {
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
describe("(2.0), Create a new role.", function() {
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
        assert.equal(res.body.data.role.roleName, config.role_test);
      })
      .expect(201, done);
  });
});

// Create role with empty field
describe("(2.0.1), Try to create a new role with missing field roleName.", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: "",
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

// Update Role OK
describe("(2.1), Update role /api/roles/:role/update", function() {
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
        assert.equal(res.body.data.role.isActive, true);
        assert.equal(res.body.data.role.roleName, config.role_testNew);
      })
      .expect(200, done);
  });
});

// Delete Role
describe("(2.2), Disable role.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/roles/" + config.role_testNew + "/update")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.data.role.isActive, false);
      })
      .expect(200, done);
  });
});

// Create role in order to check duplicity
describe("(2.3), Create another role", function() {
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
        assert.equal(res.body.data.role.roleName, config.role_test2);
      })
      .expect(201, done);
  });
});

// Update a role that already exists
describe("(2.4), Update a role with a name already in use.", function() {
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

// Create permission OK
describe("(3.0), Create a new permission.", function() {
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
          res.body.data.permission.permissionName,
          config.permission_test
        );
      })
      .expect(201, done);
  });
});

// Create permission with empty field
describe("(3.0.1), Try to create a new permission with missing field permissionName.", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: "",
        isActive: true
      })
      .expect(function(res) {
        assert.equal(res.body.ok, false);
      })
      .expect(400, done);
  });
});

// Update Permission OK
describe("(3.1), Update a permission", function() {
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
          res.body.data.permission.permissionName,
          config.permission_testNew
        );
        assert.equal(res.body.data.permission.isActive, true);
      })
      .expect(200, done);
  });
});

// Delete Permission
describe("(3.2), Disable permission.", function() {
  it("should set isActive field to false", function(done) {
    request
      .put("/api/permissions/" + config.permission_testNew + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.equal(res.body.ok, true);
        assert.equal(res.body.data.permission.isActive, false);
      })
      .expect(200, done);
  });
});

// Create permission in order to check duplicity
describe("(3.3), Create another permission", function() {
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
          res.body.data.permission.permissionName,
          config.permission_test2
        );
      })
      .expect(201, done);
  });
});

// Update a permission that already exists
describe("(3.4), Update a permission with a name already in use.", function() {
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
