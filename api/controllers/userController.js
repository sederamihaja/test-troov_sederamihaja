const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModele = require('../models/userModel');
const UserService = require('../services/userService');
const ResponseUtil = require('../utils/responseUtil');

const UserController = {};

//Login
UserController.login = async (req, res) => {  
	try {
    const { login, password } = req.body;
    const user = await UserModele.findOne({ login: login });
    if (!user)
      return res
        .status(400)
        .json({ errorFor: "login", msg: "Login incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ errorFor: "password", msg: "Mot de passe incorrect !" });

    const token = jwt.sign({ id: user._id }, 'secret');
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert a new User
UserController.insert = async (req, res) => {  
	try {
    const body = req.body;
    let { firstName, lastName, email, login, password } = body;

    const existingUser = await UserModele.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ type: "duplicate", errorFor: "email", msg: "Adresse mail déjà utilisé !" });

    const existingLogin = await UserModele.findOne({ login: login });
    if (existingLogin)
      return res
        .status(400)
        .json({ type: "duplicate", errorFor: "login", msg: "Login déjà utilisé !" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new UserModele({
      firstName,
      lastName,
      email,
      login,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    ResponseUtil.sendSuccess(res, savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve by id
UserController.findById = async (req, res) => {
	try {
		if (!req.params.id) {
			throw new Error("Utilisateur introuvable !");
		}
		const users = await UserService.findById(req.params.id);
		ResponseUtil.sendSuccess(res, users);
	} catch (err) {
		ResponseUtil.sendError(res, err);
	}
}

// Update User by id
UserController.updateById = async (req, res) => {
	try {
    const body = req.body;
		if (!body) {
			return ResponseUtil.sendWarning(res, "Les données sont vides !");
		}
    let { _id, firstName, lastName, email } = body;

    const editedUser = {
      firstName,
      lastName,
      email,
    };

		const response = await UserService.updateById(_id, editedUser);
    ResponseUtil.sendSuccess(res, response);
	} catch (err) {
    if (err.codeName === 'DuplicateKey') {
    	return res
        .status(400)
        .json({ type: "duplicate", errorFor: "email", msg: "Adresse email déjà utilisé !" });
    } else {
    	ResponseUtil.sendError(res, err);
    }
	}
};

// Get User
UserController.user = function(req, res) {
  var token = req.headers.authorization
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ''), 'secret', function(err, decoded) {
      if (err) {
        return res.status(401).json({message: 'unauthorized'})
      } else {
        return res.json({ user: decoded })
      }
    });
  }
  else{
    return res.status(401).json({message: 'unauthorized'})
  }
}

module.exports = UserController;