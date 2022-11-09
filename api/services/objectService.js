const ObjectModele = require('../models/objectModel');

const ObjectService = {};

ObjectService.create = (objectData) => new Promise((resolve, reject) => {
  const object = new ObjectModele(objectData);
  object
  .save(object)
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

ObjectService.findAll = (condition) => new Promise((resolve, reject) => {
  ObjectModele
    .find(condition)
    .then((responses) => {
      resolve(responses);
    })
    .catch((error) => {
      reject(error);
    });
});

module.exports = ObjectService;