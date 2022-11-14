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

ObjectService.findById = (_id) => new Promise((resolve, reject) => {
  ObjectModele
    .findById(_id)
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

ObjectService.updateById = (_id, data) => new Promise((resolve, reject) => {
  ObjectModele
    .findByIdAndUpdate(_id, data, { useFindAndModify: false })
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

ObjectService.deleteById = (_id) => new Promise((resolve, reject) => {
  ObjectModele
    .findOneAndRemove({
      _id   
    }, {useFindAndModify: false}).then(res => {
      resolve(res);
    });
});

module.exports = ObjectService;