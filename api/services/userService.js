const UserModele = require('../models/userModel');

const UserService = {};

UserService.create = (userData) => new Promise((resolve, reject) => {
  const user = new UserModele(userData);
  user
  .save(user)
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

UserService.findById = (_id) => new Promise((resolve, reject) => {
  UserModele
    .findById(_id)
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

UserService.updateById = (_id, data) => new Promise((resolve, reject) => {
  UserModele
    .findByIdAndUpdate(_id, data, { useFindAndModify: false })
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

module.exports = UserService;