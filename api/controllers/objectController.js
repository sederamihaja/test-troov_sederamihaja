const ObjectService = require('../services/objectService');
const ResponseUtil = require('../utils/responseUtil');

const ObjetController = {};

// Create new Object
ObjetController.create = async (req, res) => {
  try {
    const data = req.body;
    const objectInsert = await ObjectService.create(data);
		ResponseUtil.sendSuccess(res, objectInsert);
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "Erreur serveur !" });
	}
}

// Retrieve all Objects
ObjetController.findAll = async (req, res) => {
	try { 
		const objects = await ObjectService.findAll({});
		ResponseUtil.sendSuccess(res, objects);
	} catch (err) {
		ResponseUtil.sendError(res, err);
	}
};

module.exports = ObjetController;