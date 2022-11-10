const ObjectService = require('../services/objectService');
const ObjectModele = require('../models/objectModel');
const ResponseUtil = require('../utils/responseUtil');

const ObjetController = {};

// Create new Object
ObjetController.create = async (req, res) => {
  try {
    const data = req.body;

		const existingObject = await ObjectModele.findOne({ name: data.name });
    if (existingObject)
      return res
        .status(400)
        .json({ type: "duplicate", msg: "Ce nom d'objet est déjà utilisé !" });

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

// Update Object by id
ObjetController.updateById = async (req, res) => {
	try {
		const data = req.body;		
		const objectUpdated = await ObjectService.updateById(req.params.id, data);
		ResponseUtil.sendSuccess(res, objectUpdated);
	} catch (err) {
		if (err.codeName === 'DuplicateKey') {
    	return res
        .status(400)
        .json({ type: "duplicate", msg: "Ce nom d'objet est déjà utilisé !" });
    } else {
    	ResponseUtil.sendError(res, err);
    }
	}
};

//Delete Object by id
ObjetController.deleteById = async (req, res) => {
  try {
    const objectDeleted = await ObjectService.deleteById(req.params.id);
		ResponseUtil.sendSuccess(res, objectDeleted);
  } catch (err) {
    ResponseUtil.sendWarning(res, err);
  }
};

module.exports = ObjetController;