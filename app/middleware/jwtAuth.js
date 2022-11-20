const jwt = require("jsonwebtoken");
const { isNil, isEmpty } = require("ramda");
const config = require("../config/auth");
const UserService = require("../services/UserService");

const verifyToken = (req, res, next) => {
  const token = req.session?.token;

  if (isNil(token) || isEmpty(token)) {
    return res.status(403).send({ message: "Couldn't retrieve token" });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    return next();
  });
};

const requireAdmin = async (req, res, next) => {
  const { roles, error } = await UserService.getRoles({ userId: req.userId });
  if (error) {
    return res.status(500).send({ message: "Error in admin validation" });
  }
  const adminRoleIndex = roles.find((role) => role.name === "admin");
  if (!isNil(adminRoleIndex) || !isEmpty(adminRoleIndex)) {
    return next();
  }

  return res.status(403).send({ message: "Insufficient privilege" });
};

module.exports = {
  verifyToken,
  requireAdmin,
};
