const objectController = require("../controllers/objectController");

var router = require("express").Router();

// Create
router.post('/objects', objectController.create)

// Get All
router.get('/objects', objectController.findAll)

module.exports = router