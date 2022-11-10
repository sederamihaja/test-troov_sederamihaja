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

    const existingLogin = await UserModele.findOne({ login: login });
    if (existingLogin)
      return res
        .status(400)
        .json({ type: "duplicate", errorFor: "login", msg: "Login déjà utilisé !" });

    const existingUser = await UserModele.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ type: "duplicate", errorFor: "email", msg: "Adresse mail déjà utilisé !" });

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

// Update User by id
UserController.updateById = async (req, res) => {
	try {
    const body = req.body;
		if (!body) {
			return ResponseUtil.sendWarning(res, "Les données sont vides !");
		}
    let { _id, firstName, lastName, email, login, password } = body;

    const theUser = await UserService.findById(_id);
    const theUserPass = theUser.password;

    var passwordHash = '';

    if (password !== theUser.password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    } else {
      passwordHash = theUserPass;
    }

    const editedUser = {
      firstName,
      lastName,
      email,
      login,
      password: passwordHash,
    };

		const response = await UserService.updateById(_id, editedUser);
    ResponseUtil.sendSuccess(res, response);
	} catch (err) {
    if (err.codeName === 'DuplicateKey') {
    	return res
        .status(400)
        .json({ type: "duplicate", msg: "Information déjà utilisée !" });
    } else {
    	ResponseUtil.sendError(res, err);
    }
	}
};

module.exports = UserController;