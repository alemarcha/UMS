module.exports = {
  // Default user/password for testing
  email_default_test: "email_test@mail.com",
  email_default_test2: "email_test2@mail.com",
  email_default_test3: "email_test3@mail.com",
  email_default_test4: "email_test4@mail.com",
  email_default_test5: "email_test5@mail.com",
  email_default_test_fake: "email_test_fake@mail.com",
  email_tester_full: "userwithroles@email.com",
  password_default_test: "password",
  password_default_test2: "password2",
  password_default_test2_new: "password2New",
  user_name_default_test_fake: "username_fake",
  user_name_default_test: "username",
  user_name_default_test2: "username2",
  user_name_default_test4: "username4",
  last_name_default_test: "lastname",
  last_name_default_test_fake: "lastname_fake",
  user_name_tester_full: "userwith",
  last_name_tester_full: "roles",

  // Activate
  isActive: true,

  // role
  role_test: "admin_test",
  role_test2: "admin_test2",
  role_test3: "admin_test3",
  role_test4: "admin_test4",
  role_test_fake: "admin_test_fake",
  role_testNew: "role_updated",
  role_testNew2: "role_updated",
  role_perms: "rolewithperms",
  roles_user: ["admin_test2", "admin_test4"],
  roles_user_disabledRole: ["role_updated"],
  roles_user_tester: ["admin_test4"],
  roles_user_Fake: ["admin_FAKE", "admin_test4"],

  // permission
  permission_test: "create_test",
  permission_test2: "create_test2",
  permission_test3: "create_test3",
  permission_test4: "create_test4",
  permission_test_fake: "create_test4_fake",
  permission_testNew: "permission_updated",
  permission_testNew2: "permission_updated",
  permission_roles: ["create_test2", "create_test4"],
  permission_roles2: ["create_test4"],
  permission_roles_disabledPerm: ["permission_updated"],
  permission_roles_Fake: ["permission_FAKE", "create_test4"]
};
