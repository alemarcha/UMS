process.env.ENVIRONMENT = "test";
let jwtHashWithDifferentSecretKey =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTgzZWUxZDI1ZGQzNzA0ZDM0MmMzZTgiLCJpYXQiOjE1MjA5MzI3NzgsImV4cCI6MTUyOTkwMjAwMH0.YqnAxi7m92ieWdwmSz6tFt7Vt9KOkrUjTFIUpQmmzbqUArR9x21D5r0za1d-wPtJrTmkmyquU6Dc3RPuxNOyN31G5Pee77etLd8ORoPr7NfmeFPRd2KHEy3j7bSzFCDB0lnQzvpvnNQ6pYe7dNx5TbdZSD36mF3tKUa9zFcaEe2jBFuToomSkrw7W06MaTpF_UHzndi8TqEkNXyDDk9ihbEftZ9pso6QvtmBCJTK-aM-ZeUTjtWm_-8pPQJCXcXC2zB3E38yc9lBdEXF9JODHZQLQSaSZOAxrvKFBL5baKXUU-VQlXWobI_txl_D3Coxc5UhhAuI9YcBh7hgDtujcQ-yvt19df4grPMJ2IYxg-Kb4TFePz3S1qcuvQixUFkrdz1mFqwPgzrU3jj368xjRw6XC0MwYlLrmBfnCCeNFGic9RhT86SkOipQQL0Pw_0gP6REIsoRc8wjBgDjhdMiUPmROJ1NxdS003h3yvbd1l9VmvrNMMdIu3_mYPo70zsyCioRYk6s3BOBU0jb6oYvdvI57-tRvj1ENhLIGo8VECpB08fJ-vqLvX4_6-EBCIOPqgHFObXoEOnw8FESfDUUIBF1ecD1OSrnEC5H7gzz84dg3uriAZ7xe410jWCQtIug2WAvZPu49y2EJW545nwvEcMUqWv6bRkYadZ2K70aov4";
let jwtExpired =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTgzZWUxZDI1ZGQzNzA0ZDM0MmMzZTgiLCJpYXQiOjE1MjA5MzI3NzgsImV4cCI6MTUyMDAwMjAwMH0.vonURWH11B1l3Q-zXOXA7WZoUOOH6kJOI15r6QtEKEgVdBtgVy9vUNQsPzhzpjzEBKJIWxi_6U0RU8w4ppojhzPtTJFcyBQgpvRBqy9EnCCxPMTZr-uOSB3L6BW47SfZGZbfqZfpv-ErultufQjhTzbcM5nF574BWUKal2nyytMCnKJiydFNK9XPMNFXRBWYwFwGfoEZ4EzjyzqC8oi-Byb1ZpLYI3SIExTOt8yx_mEh8HXEooQqDVmlNPViIsWzCm59OYd3yYDz8SlLmcsFCtLQPrQzBeGIYZvslkgTTzq6cK7io3i0qEqHASAnf6KA6Dd83KkQuneY3XguFaj4XP3I6r3pT8TkQWt7dfWD-ZItc7u_v5Hp-eOR1l3CJQnnxAir_YfDbxR9q7VindyChUsVeio1IGrmWP_5z0Suhj6jlKVYtZY2buzwRZvKpWHTDKJGSmY9zYR5UL2RQ4fe7CLki5qtAR48OOW3QfH6VvA6RjuICjj876jHB2O6QvWut5wmD0gS_HWLwKpYdER3l-96y5X9eTejNPHnj2O8gLx1xEdPfoeixVFjNTZPtwsfDztThSOkjfsx3KfiV9moSu-2rCUtegSKue57Aaj9TMCmm0cxEPc0DgUAXwHBQO1EQL_vH5IL-7-WIiQwwEu5QH-tjQSW0TwUWWyfxmkTkVg";
let jwtValid = "";

let mongoose = require("mongoose");
let app = require("../server.js");
let config = require("./test_variables.js");
let request = require("supertest")(app);
let assert = require("chai").assert;
let expect = require("chai").expect;

/**
 * Integration tests with TDD Styles
 * */
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

// Cover 404 error
describe("(0.1.1), Handle 404 error test", function() {
  it("should try to find a route that does not exist ", function(done) {
    request
      .get("/api/asfsz")
      .set("Content-Type", "application/json")
      .expect(404)
      .end(function(err, res) {
        assert.isNotOk(res.body.ok);
        done(err);
      });
  });
});

// Check if JWT is expired
describe("(1.0.0), GET /api/users/validJWT with jwt expired", function() {
  it("should render 401", function(done) {
    request
      .get("/api/users/validJWT")
      .set({ Authorization: "JWT " + jwtExpired })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401)
      .end(done);
  });
});

// Check if JWT is valid
describe("(1.0.1), GET /api/users/validJWT with jwt hashed with different secret key", function() {
  it("should render 200 ok", function(done) {
    request
      .get("/api/users/validJWT")
      .set({ Authorization: "JWT " + jwtHashWithDifferentSecretKey })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401)
      .end(done);
  });
});

//User Register created OK
describe("(1.1,0), Register a new user", function() {
  it("POST User Register created OK", function(done) {
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
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.user.email, config.email_default_test);
      })
      .expect(201, done);
  });
});

//User Register created to Update OK
describe("(1.1.1), User Register created to Update.", function() {
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
        assert.isOk(res.body.ok);
        assert.strictEqual(
          res.body.data.user.email,
          config.email_default_test2
        );
      })
      .expect(201, done);
  });
});

//User Register created OK
describe("(1.1.2), Register a new user", function() {
  it("POST User Register created OK", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test4,
        password: config.password_default_test,
        firstName: config.user_name_default_test4,
        lastName: config.last_name_default_test
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(
          res.body.data.user.email,
          config.email_default_test4
        );
      })
      .expect(201, done);
  });
});

//User Register duplicated
describe("(1.1.3), User Register that is duplicated", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(409, done);
  });
});

//User Register error email empty
describe("(1.1.4), User Register error with a empty email.", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

//User Register error firstName empty
describe("(1.1.5), User Register error with a empty firstName.", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

//User Register error lastname empty
describe("(1.1.6), User Register error with a empty lastname.", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

//User Register error password empty
describe("(1.1.7), User Register error with a empty password.", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

//User updated user duplicate email OK
describe(
  "(1.2.0), PUT Update incorrect user /api/users/" +
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
          assert.isNotOk(res.body.ok);
        })
        .expect(409, done);
    });
  }
);

//User updated Password with no correct current password OK
describe(
  "(1.3.0), PUT Update password with no correct current password /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: config.password_default_test2 + "fake",
          newPassword: config.password_default_test2_new,
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);
//User updated Password with empty current password no OK
describe(
  "(1.3.1), PUT Update password with empty current password /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: "",
          newPassword: config.password_default_test2_new,
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(405, done);
    });
  }
);

//User updated Password with empty new password no OK
describe(
  "(1.3.2), PUT Update password with empty new password /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: config.password_default_test2,
          newPassword: "",
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(405, done);
    });
  }
);

//User updated Password with not equals new password no OK
describe(
  "(1.3.3), PUT Update password with not equals new password /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: config.password_default_test2,
          newPassword: config.password_default_test2_new + "fake",
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

//User updated Password OK
describe(
  "(1.3.4), PUT Update password correct user /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: config.password_default_test2,
          newPassword: config.password_default_test2_new,
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isOk(res.body.ok);
          console.log(res.body);
        })
        .expect(200, done);
    });
  }
);

//User Login user with new Password OK
describe("(1.4.0), Log-in user in the system with new Password /api/users/login", function() {
  it("should render not ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: config.password_default_test2_new
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.exists(res.body.data.token);
        assert.strictEqual(
          res.body.data.user.email,
          config.email_default_test2
        );
        jwtValid = res.body.data.token;
      })
      .expect(200, done);
  });
});

//User Login user with old Password NO OK
describe("(1.4.1), Log-in user in the system with old Password /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test2,
        password: config.password_default_test2
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401, done);
  });
});

//User log-in OK
describe("(1.4.2), Log-in user in the system /api/users/login", function() {
  it("should render ok", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test,
        password: config.password_default_test
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.exists(res.body.data.token);
        assert.strictEqual(
          res.body.data.user.firstName,
          config.user_name_default_test
        );
        jwtValid = res.body.data.token;
      })
      .expect(200, done);
  });
});

//User updated OK
describe(
  "(1.2.1), PUT Update correct user /api/users/" +
    config.email_default_test2 +
    "/update",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/update")
        .set("Content-Type", "application/json")
        .send({
          email: config.email_default_test3,
          firstName: config.user_name_default_test2,
          lastName: config.last_name_default_test
        })
        .expect(function(res) {
          assert.isOk(res.body.ok);
          assert.strictEqual(
            res.body.data.user.email,
            config.email_default_test3
          );
          assert.strictEqual(
            res.body.data.user.firstName,
            config.user_name_default_test2
          );
          assert.strictEqual(
            res.body.data.user.lastName,
            config.last_name_default_test
          );
        })
        .expect(200, done);
    });
  }
);

//API Check if JWT save after login is valid
describe("(1.0.2), Check if JWT save after login is valid", function() {
  it("should render 200 ok", function(done) {
    request
      .get("/api/users/validJWT")
      .set({ Authorization: "JWT " + jwtValid })
      .expect(function(res) {
        assert.isOk(res.body.ok);
      })
      .expect(200)
      .end(done);
  });
});

// API Try to refresh invalid token
describe("(1.0.3), GET Try to refresh invalid token", function() {
  it("should render 401", function(done) {
    request
      .get("/api/users/refreshJWT")
      .set({ Authorization: "JWT " + jwtHashWithDifferentSecretKey })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401)
      .end(done);
  });
});

// API Try to refresh an expired token
describe("(1.0.4), API Try to refresh an expired token", function() {
  it("should render 401", function(done) {
    request
      .get("/api/users/refreshJWT")
      .set({ Authorization: "JWT " + jwtExpired })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401)
      .end(done);
  });
});

// API Try to refresh a valid token
describe("(1.0.5), Try to refresh a valid token ", function() {
  it("should render 200 ok", function(done) {
    request
      .get("/api/users/refreshJWT")
      .set({ Authorization: "JWT " + jwtValid })
      .expect(function(res) {
        assert.isOk(res.body.ok);
      })
      .expect(200)
      .end(done);
  });
});

// Delete User
describe("(1.5.0), Disable user.", function() {
  it("should set isActive field to false", function(done) {
    request
      .delete("/api/users/" + config.email_default_test + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
      })
      .expect(200, done);
  });
});

// 401 Unauthorized password
describe("(1.4.3), Try to access with incorrect password.", function() {
  it("should give an error 401, unauthorized", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test,
        password: config.password_default_test + "_fake"
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401, done);
  });
});

// 401 Unauthorized user
describe("(1.4.4), Try to access with incorrect email.", function() {
  it("should give an error 401, unauthorized", function(done) {
    request
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test + "_fake",
        password: config.password_default_test
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(401, done);
  });
});

//User updated Password with no correct current password OK
describe(
  "(1.3.5), PUT Update password with no correct current password /api/users/" +
    config.email_default_test2 +
    "/updatePassword",
  function() {
    it("should render ok", function(done) {
      request
        .put("/api/users/" + config.email_default_test2 + "/updatePassword")
        .set("Content-Type", "application/json")
        .send({
          currentPassword: config.password_default_test2 + "fake",
          newPassword: config.password_default_test2_new,
          repeatNewPassword: config.password_default_test2_new
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

// Create Role OK
describe("(2.0.0), Create a new role.", function() {
  it("should render created 201", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.role.roleName, config.role_test);
      })
      .expect(201, done);
  });
});
// Create role in order to check duplicity
describe("(2.0.1), Create another role", function() {
  it("should render ok", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.role.roleName, config.role_test2);
      })
      .expect(201, done);
  });
});

// Create another role
describe("(2.0.2), Create another role in order to use an array of roles.", function() {
  it("should render created 201", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test4,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.role.roleName, config.role_test4);
      })
      .expect(201, done);
  });
});

// Create role with empty field
describe("(2.0.3), Try to create a new role with missing field roleName.", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: "",
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

// Create a role that already exists
describe("(2.0.4), Try to create a role with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(409, done);
  });
});

// Update Role OK
describe("(2.1.0), Update role /api/roles/:role/update", function() {
  it("should render ok", function(done) {
    request
      .put("/api/roles/" + config.role_test + "/update")
      .set("Content-Type", "application/json")
      .send({
        newRoleName: config.role_testNew,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.isOk(res.body.data.role.isActive);
        assert.strictEqual(res.body.data.role.roleName, config.role_testNew);
      })
      .expect(200, done);
  });
});

// Update a role that already exists
describe("(2.1.1), Try to update a role with a name already in use.", function() {
  it("should fail, 409 Conflict", function(done) {
    request
      .put("/api/roles/" + config.role_test2 + "/update")
      .set("Content-Type", "application/json")
      .send({
        newRoleName: config.role_testNew2,
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(409, done);
  });
});

// Update user with an array of roles
describe(
  "(1.2.2), PUT Update user with an array of roles /api/users/" +
    config.email_default_test3 +
    "/update",
  function() {
    it("should add certain roles to the array", function(done) {
      request
        .put("/api/users/" + config.email_default_test3 + "/update")
        .set("Content-Type", "application/json")
        .send({
          roles: config.roles_user
        })
        .expect(function(res) {
          assert.isOk(res.body.ok);
          assert.strictEqual(
            res.body.data.user.email,
            config.email_default_test3
          );
          assert.equal(res.body.data.user.roles.length, 2);
          res.body.data.user.roles.forEach(element => {
            assert.include(config.roles_user, element.roleName);
          });
        })
        .expect(200, done);
    });
  }
);

// Delete Role
describe("(2.2.0), Disable role.", function() {
  it("should set isActive field to false", function(done) {
    request
      .delete("/api/roles/" + config.role_testNew + "/delete")
      .set("Content-Type", "application/json")
      .send({})
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.role.isActive, false);
      })
      .expect(200, done);
  });
});

// Try to update a user with an array of roles with a permission disabled
describe(
  "(1.2.3), Try to update user with an array of roles that are disabled /api/users/" +
    config.email_default_test3 +
    "/update",
  function() {
    it("should try to add certain roles to the array that are disabled", function(done) {
      request
        .put("/api/users/" + config.email_default_test3 + "/update")
        .set("Content-Type", "application/json")
        .send({
          roles: config.roles_user_disabledRole
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

// Update the user with a role array in which one of them does not exist
describe(
  "(1.2.4), Try to update a user with a role that does not exist /api/users/" +
    config.email_default_test +
    "/update",
  function() {
    it("should try to add certain roles to the array", function(done) {
      request
        .put("/api/users/" + config.email_default_test + "/update")
        .set("Content-Type", "application/json")
        .send({
          roles: config.roles_user_Fake
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

// Create permission OK
describe("(3.0.0), Create a new permission.", function() {
  it("should render created 201 code", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(
          res.body.data.permission.permissionName,
          config.permission_test
        );
      })
      .expect(201, done);
  });
});

// Create permission
describe("(3.0.1), Create another permission", function() {
  it("should render ok", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(
          res.body.data.permission.permissionName,
          config.permission_test2
        );
      })
      .expect(201, done);
  });
});

// Create another permission
describe("(3.0.2), Create another permission in order to use an array of permissions.", function() {
  it("should render created 201", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test4,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(
          res.body.data.permission.permissionName,
          config.permission_test4
        );
      })
      .expect(201, done);
  });
});

// Try to create a permission with a name already in use
describe("(3.0.3), Try to create a permission with a name already in use.", function() {
  it("should render ok", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: config.permission_test2,
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(409, done);
  });
});

// Create permission with empty field
describe("(3.0.4), Try to create a new permission with missing field permissionName.", function() {
  it("should fail, expected a 400 code", function(done) {
    request
      .post("/api/permissions/create")
      .set("Content-Type", "application/json")
      .send({
        permissionName: "",
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

// Update Permission OK
describe("(3.1.0), Update a permission", function() {
  it("should render ok", function(done) {
    request
      .put("/api/permissions/" + config.permission_test + "/update")
      .set("Content-Type", "application/json")
      .send({
        newPermissionName: config.permission_testNew,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.equal(
          res.body.data.permission.permissionName,
          config.permission_testNew
        );
        assert.strictEqual(res.body.data.permission.isActive, true);
      })
      .expect(200, done);
  });
});

// Update a permission that already exists
describe("(3.1.1), Update a permission with a name already in use.", function() {
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
        assert.isNotOk(res.body.ok);
      })
      .expect(409, done);
  });
});

// Update role with an array of permissions
describe(
  "(2.1.2), Update a role with an array of permissions /api/roles/" +
    config.role_test4 +
    "/update",
  function() {
    it("should add certain permissions to the array", function(done) {
      request
        .put("/api/roles/" + config.role_test4 + "/update")
        .set("Content-Type", "application/json")
        .send({
          permissions: config.permission_roles
        })
        .expect(function(res) {
          assert.isOk(res.body.ok);
          assert.strictEqual(res.body.data.role.roleName, config.role_test4);
          assert.equal(res.body.data.role.permissions.length, 2);
          res.body.data.role.permissions.forEach(element => {
            assert.include(config.permission_roles, element.permissionName);
          });
        })
        .expect(200, done);
    });
  }
);

// Update the role with a permission array in which one of them does not exist
describe(
  "(2.1.3), Try to update a role with a permission that does not exist /api/roles/" +
    config.permission_testNew +
    "/update",
  function() {
    it("should try to add certain permissions to the array", function(done) {
      request
        .put("/api/roles/" + config.permission_testNew + "/update")
        .set("Content-Type", "application/json")
        .send({
          permissions: config.permission_roles_Fake
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

// Delete Permission
describe("(3.2.0), Disable permission.", function() {
  it("should set isActive field to false", function(done) {
    request
      .delete("/api/permissions/" + config.permission_testNew + "/delete")
      .set("Content-Type", "application/json")
      .send({
        isActive: false
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.equal(res.body.data.permission.isActive, false);
      })
      .expect(200, done);
  });
});

// Update role with an array of permissions with a permission disabled
describe(
  "(2.1.4), Update a role with an array of permissions with a permission disabled /api/roles/" +
    config.role_test4 +
    "/update",
  function() {
    it("should try to add certain permissions to the array that are disabled", function(done) {
      request
        .put("/api/roles/" + config.role_test4 + "/update")
        .set("Content-Type", "application/json")
        .send({
          permissions: config.permission_roles_disabledPerm
        })
        .expect(function(res) {
          assert.isNotOk(res.body.ok);
        })
        .expect(400, done);
    });
  }
);

//User Register created with roles OK
describe("(1.1.8), Register a new user with and array of roles", function() {
  it("should create a user with a valid array of roles", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_tester_full,
        password: config.password_default_test,
        firstName: config.user_name_tester_full,
        lastName: config.last_name_tester_full,
        roles: config.roles_user_tester
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.user.email, config.email_tester_full);
      })
      .expect(201, done);
  });
});

// User Register try to create with invalid roles
describe("(1.1.9), Try to register a new user with an invalid array of roles.", function() {
  it("should fail, because a role does not exist or the role is not active", function(done) {
    request
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        email: config.email_default_test5,
        password: config.password_default_test,
        firstName: config.user_name_tester_full,
        lastName: config.last_name_tester_full,
        roles: config.roles_user_Fake
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

// Create another role with permission array
describe("(2.0.5), Create another role with an array of permissions.", function() {
  it("should render created 201", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_perms,
        permissions: config.permission_roles2,
        isActive: true
      })
      .expect(function(res) {
        assert.isOk(res.body.ok);
        assert.strictEqual(res.body.data.role.roleName, config.role_perms);
      })
      .expect(201, done);
  });
});

// Try to create a role with invalid permission array
describe("(2.0.6), Try to create a role with invalid permission array.", function() {
  it("should fail, because a role does not exist or the role is not active", function(done) {
    request
      .post("/api/roles/create")
      .set("Content-Type", "application/json")
      .send({
        roleName: config.role_test,
        permissions: config.permission_roles_Fake,
        isActive: true
      })
      .expect(function(res) {
        assert.isNotOk(res.body.ok);
      })
      .expect(400, done);
  });
});

/**
 *
 *  SEARCH users, roles, permissions
 *
 * **/

// Search 1 User exist by email
describe("(1.6.0), Search  1 user by email which is not active", function() {
  it(
    "should try to find users with a email which contains " +
      config.email_default_test +
      " and is not active",
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          email: config.email_default_test
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(0);
          done(err);
        });
    }
  );
});

// Search 1 User exist by email
describe("(1.6.1), Search 1 active users by exacly match email which is not active", function() {
  it(
    "should try to find users with a email which contains " +
      config.email_default_test3 +
      " and is active",
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          email: config.email_default_test3
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(1);
          res.body.data.users.forEach(user => {
            expect(user.email).to.have.string(config.email_default_test3);
          });
          done(err);
        });
    }
  );
});

// Search User by email which does not exists
describe("(1.6.2), Search active users by email which does not exists", function() {
  it(
    "should try to find users with a email which contains " +
      config.email_default_test_fake +
      " but do not exists",
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          email: config.email_default_test_fake
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(0);
          done(err);
        });
    }
  );
});

// Search 2 Users by name
describe("(1.6.3),Search active users  by name ", function() {
  it(
    "should try to find users with a name which contains " +
      config.user_name_default_test,
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.user_name_default_test
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(2);
          res.body.data.users.forEach(user => {
            expect(user.firstName).to.have.string(
              config.user_name_default_test
            );
          });
          done(err);
        });
    }
  );
});

// Search Users by name which do not exist
describe("(1.6.4), Search active users by name  which do not exist", function() {
  it(
    "should try to find users with a name which contains " +
      config.user_name_default_test_fake +
      " but do not exists",
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.user_name_default_test_fake
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(0);
          done(err);
        });
    }
  );
});

// Search 2 Users by lastName
describe("(1.6.5), Search active users by lastname", function() {
  it(
    "should try to find users with a lastName which contains " +
      config.last_name_default_test,
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          lastName: config.last_name_default_test
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(2);
          res.body.data.users.forEach(user => {
            expect(user.lastName).to.have.string(config.last_name_default_test);
          });
          done(err);
        });
    }
  );
});

// Search Users by lastName which do not exist
describe("(1.6.6), Search active users by lastname  which do not exist", function() {
  it(
    "should try to find users with a lastName which contains " +
      config.last_name_default_test_fake +
      " but do not exists",
    function(done) {
      request
        .get("/api/users/search")
        .set("Content-Type", "application/json")
        .query({
          lastName: config.last_name_default_test_fake
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.ok).to.equal(true);
          expect(res.body.data.users).to.have.lengthOf(0);
          done(err);
        });
    }
  );
});

// Search Users by roles
describe("(1.6.7), Search active users by roles", function() {
  it("should try to find users which contains some of two roles ", function(done) {
    request
      .get("/api/users/search")
      .set("Content-Type", "application/json")
      .query({
        roles: config.role_test2 + "," + config.role_test4
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.ok).to.equal(true);
        expect(res.body.data.users).to.have.lengthOf(2);
        res.body.data.users.forEach(user => {
          let role = user.roles.find(role => {
            return (
              role.roleName === config.role_test4 ||
              role.roleName === config.role_test2
            );
          });
          assert.isNotNull(role);
        });

        done(err);
      });
  });
});

// Search Users by roles
describe("(1.6.8), Search active users by roles", function() {
  it("should try to find users which contains one role. ", function(done) {
    request
      .get("/api/users/search")
      .set("Content-Type", "application/json")
      .query({
        roles: config.role_test2
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.ok).to.equal(true);
        expect(res.body.data.users).to.have.lengthOf(1);
        res.body.data.users.forEach(user => {
          let role = user.roles.find(role => {
            return role.roleName === config.role_test2;
          });
          assert.isNotNull(role);
        });
        done(err);
      });
  });
});

// Search roles by roleName
describe("(2.3.0), Search 2 roles by name which are active", function() {
  it(
    "should try to find roles with a name which contains " +
      config.role_test +
      " and is active",
    function(done) {
      request
        .get("/api/roles/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.role_test
        })
        .expect(200)
        .end(function(err, res) {
          assert.isOk(res.body.ok);
          assert.lengthOf(res.body.data.roles, 2);
          res.body.data.roles.forEach(role => {
            expect(role.roleName).to.have.string(config.role_test);
          });
          done(err);
        });
    }
  );
});

// Search role which is not active
describe("(2.3.1), Search  1 role by name which is not active", function() {
  it(
    "should try to find roles with a name which contains " +
      config.role_testNew +
      " and is not active",
    function(done) {
      request
        .get("/api/roles/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.role_testNew
        })
        .expect(200)
        .end(function(err, res) {
          assert.isOk(res.body.ok);
          assert.lengthOf(res.body.data.roles, 0);
          done(err);
        });
    }
  );
});

// Search role which does not exist
describe("(2.3.2), Search roles by name which does not exist", function() {
  it("should try to find roles with a name which does not exist", function(done) {
    request
      .get("/api/roles/search")
      .set("Content-Type", "application/json")
      .query({
        name: config.role_test_fake
      })
      .expect(200)
      .end(function(err, res) {
        assert.isOk(res.body.ok);
        assert.lengthOf(res.body.data.roles, 0);
        done(err);
      });
  });
});

// Search Roles by permissions
describe("(2.3.3), Search active roles by permissions", function() {
  it("should try to find users which contains one role. ", function(done) {
    request
      .get("/api/roles/search")
      .set("Content-Type", "application/json")
      .query({
        permissions: config.permission_test2 + "," + config.permission_test4
      })
      .expect(200)
      .end(function(err, res) {
        assert.isOk(res.body.ok);
        assert.lengthOf(res.body.data.roles, 2);
        res.body.data.roles.forEach(role => {
          let permission = role.permissions.find(permission => {
            return (
              permission.permissionName === config.permission_test2 ||
              permission.permissionName === config.permission_test4
            );
          });
          assert.isNotNull(permission);
        });
        done(err);
      });
  });
});

// Search Roles by permissions
describe("(2.3.4), Search active roles by permissions", function() {
  it("should try to find roles which contains one permission. ", function(done) {
    request
      .get("/api/roles/search")
      .set("Content-Type", "application/json")
      .query({
        permissions: config.permission_test2
      })
      .expect(200)
      .end(function(err, res) {
        assert.isOk(res.body.ok);
        assert.lengthOf(res.body.data.roles, 1);
        res.body.data.roles.forEach(role => {
          let permissionFind = role.permissions.find(permission => {
            return permission.permissionName === config.permission_test2;
          });
          assert.isNotNull(permissionFind);
        });
        done(err);
      });
  });
});

// Search permissions by permissionName
describe("(3.3.0), Search 1 permissions by name which is active", function() {
  it(
    "should try to find permissions with a name which contains " +
      config.permission_test2 +
      " and is active",
    function(done) {
      request
        .get("/api/permissions/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.permission_test2
        })
        .expect(200)
        .end(function(err, res) {
          assert.isOk(res.body.ok);
          assert.lengthOf(res.body.data.permissions, 1);
          res.body.data.permissions.forEach(permission => {
            expect(permission.permissionName).to.have.string(
              config.permission_test2
            );
          });
          done(err);
        });
    }
  );
});

// Search permissions by roleName which is not active
describe("(3.3.1), Search 1 permissions by name which is not active", function() {
  it(
    "should try to find permissions with a name which contains " +
      config.permission_testNew +
      " and is active",
    function(done) {
      request
        .get("/api/permissions/search")
        .set("Content-Type", "application/json")
        .query({
          name: config.permission_testNew
        })
        .expect(200)
        .end(function(err, res) {
          assert.isOk(res.body.ok);
          assert.lengthOf(res.body.data.permissions, 0);
          done(err);
        });
    }
  );
});

// Search permissions by permissionName which  does not exist
describe("(3.3.2), Search permissions by name which does not exist", function() {
  it("should try to find roles with a name whichd does not exist ", function(done) {
    request
      .get("/api/permissions/search")
      .set("Content-Type", "application/json")
      .query({
        name: config.permission_test_fake
      })
      .expect(200)
      .end(function(err, res) {
        assert.isOk(res.body.ok);
        assert.lengthOf(res.body.data.permissions, 0);
        done(err);
      });
  });
});
