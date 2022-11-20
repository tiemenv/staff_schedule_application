const UserService = require("../services/UserService");
const AuthService = require("../services/AuthService");
const { UserCreateSchema } = require("../schemas/User");
const LoginSchema = require("../schemas/Login");

exports.register = async (req, res) => {
  const { error: validationError } = UserCreateSchema.validate(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError.message });
  }
  const { username, password } = req.body;
  const { error } = await UserService.create({ username, password });
  if (error) {
    switch (error) {
      case "USERNAME_TAKEN":
        return res.status(400).send({ message: "Username already taken" });
      default:
        return res.status(500).send({ message: "Error in user registration" });
    }
  }
  return res.status(201).send({ message: "User created" });
};

exports.login = async (req, res) => {
  const { error: validationError } = LoginSchema.validate(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError.message });
  }
  const { username, password } = req.body;
  const { token, error } = await AuthService.login({ username, password });
  if (error) {
    switch (error) {
      case "INVALID_LOGIN":
        return res.status(401).send({ message: "Invalid login info" });
      default:
        return res.status(500).send({ message: "Error in login service" });
    }
  }
  req.session.token = token;

  return res.status(200).send({ message: "Login successful" });
};

exports.logout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "Logout successful" });
  } catch (err) {
    this.next(err);
  }
};
