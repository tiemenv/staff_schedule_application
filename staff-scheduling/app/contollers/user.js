const { UserUpdateSchema } = require("../schemas/User");
const UserService = require("../services/UserService");

// ranking based on scheduled hours
exports.getUsers = async (req, res) => {
  let { searchFrom, searchTill } = req.query;
  if (searchFrom) {
    searchFrom = new Date(parseInt(searchFrom, 10));
  }
  if (searchTill) {
    searchTill = new Date(parseInt(searchTill, 10));
  }
  const { users, error } = await UserService.getUserList({ searchFrom, searchTill });
  if (error) {
    return res.status(500).send({ message: "Error listing users" });
  }
  return res.status(200).send({ users });
};

// update a user
// change username, password and roles, only as admin
exports.updateUser = async (req, res) => {
  const { error: validationError } = UserUpdateSchema.validate(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError.message });
  }
  const { username, password, roles } = req.body;
  const { userId } = req.params;
  const { error } = await UserService.update({
    userId, username, password, roles,
  });
  if (error) {
    switch (error) {
      case "USERNAME_TAKEN":
        return res.status(400).send({ message: "Username already taken" });
      case "INVALID_ROLE":
        return res.status(400).send({ message: "Invalid role" });
      default:
        return res.status(500).send({ message: "Error in user update service" });
    }
  }
  return res.status(200).send({ message: "User updated" });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  const { error } = await UserService.remove({ userId });
  if (error) {
    switch (error) {
      case "USER_NOT_FOUND":
        return res.status(400).send({ message: "User doesn't exist" });
      default:
        return res.status(500).send({ message: "Error in user delete service" });
    }
  }
  return res.status(200).send({ message: "User deleted" });
};
