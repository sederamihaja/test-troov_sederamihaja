const users = require("../controllers/userController");

var router = require("express").Router();

router.route("/user")
  // Insert a new User
  .post(
    users.insert
  )
  // Update User
  .put(
    users.updateById
  )

router.route("/user/login")
  // Login
  .post(users.login)

module.exports = router;