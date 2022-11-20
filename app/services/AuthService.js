const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("./UserService");
const config = require("../config/auth");

const login = async ({ username, password }) => {
  try {
    const { user, error: userServiceError } = await UserService.getUser({ username });

    if (userServiceError) {
      return { error: userServiceError };
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user?.password || "",
    );

    if (!passwordIsValid) {
      return { error: "INVALID_LOGIN" };
    }

    // assume valid login details
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 24 * 60 * 60,
    });

    return { token };
  } catch (error) {
    return { error };
  }
};

const AuthService = {
  login,
};

module.exports = AuthService;
