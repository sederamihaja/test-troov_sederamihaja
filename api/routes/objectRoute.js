const objectController = require("../controllers/objectController");

var router = require("express").Router();

router.route('/objects')
  // Create
  .post(objectController.create)
  // Get All
  .get(objectController.findAll)

router.route("/objects/:id")
  // Update by id
  .put(objectController.updateById)
  // Delete by id
  .delete(objectController.deleteById);

module.exports = router