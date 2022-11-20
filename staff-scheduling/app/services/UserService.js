const { isNil, isEmpty } = require("ramda");
const bcrypt = require("bcryptjs");

let _repo = null;

const initService = (userRepository) => {
  _repo = userRepository;
};

const getUserList = async ({ searchFrom, searchTill }) => {
  try {
    const users = await _repo.getUsersOrderedByHoursScheduled({ searchFrom, searchTill });
    return { users };
  } catch (error) {
    return { error };
  }
};

const getUser = async ({ userId, username }) => {
  try {
    let user = null;
    if (userId) {
      user = await _repo.findById({ userId, raw: true });
    } else if (username) {
      user = await _repo.findByUsername({ username, raw: true });
    }
    if (!user) {
      return { error: "USER_NOT_FOUND" };
    }
    return { user };
  } catch (error) {
    return { error };
  }
};

const getRoles = async ({ userId }) => {
  try {
    const roles = await _repo.getUserRoles({ userId });
    if (isNil(roles) || isEmpty(roles)) {
      return { error: "NO_ROLES_FOUND" };
    }
    return { roles };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {string} options.username
 * @param {string} options.password
 * @returns {Promise}
 */
const create = async ({ username, password }) => {
  try {
    // hash password
    const hashedPassword = bcrypt.hashSync(password);
    // check if name is available
    const existingUser = await _repo.findByUsername({ username, raw: true });

    if (existingUser) {
      return { error: "USERNAME_TAKEN" };
    }

    const user = await _repo.insert({
      username,
      password: hashedPassword,
    });

    if (isNil(user) || isEmpty(user)) {
      return { error: "INSERT_USER_ERROR", success: false };
    }
    return { success: true };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {number} options.userId
 * @param {string} [options.username]
 * @param {string} [options.password]
 * @param {string[]} [options.roles]
 * @returns {Promise}
 */
const update = async ({
  userId, username, password, roles,
}) => {
  try {
    // check if username is taken
    const updateObject = {};
    if (username) {
      const existingUsernameUser = await _repo.findByUsername({ username, raw: true });
      if (existingUsernameUser) {
        return { error: "USERNAME_TAKEN" };
      }
      updateObject.username = username;
    }
    if (password) {
      const hashedPassword = bcrypt.hashSync(password);
      updateObject.password = hashedPassword;
    }
    if (roles) {
      // check if all roles are valid
      if (!roles.every((role) => ["user", "admin"].includes(role))) {
        return { error: "INVALID_ROLE" };
      }
      updateObject.roles = roles;
    }
    const user = await _repo.update({
      userId,
      ...updateObject,
    });
    if (isNil(user) || isEmpty(user)) {
      return { error: "UPDATE_USER_ERROR" };
    }
    return { success: true };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {number} options.userId
 * @returns {Promise}
 */
const remove = async ({ userId }) => {
  // we might want to prevent/warn deletion of a user with schedules still attached
  try {
    const { success, error } = await _repo.remove({
      userId,
    });
    return { success, error };
  } catch (error) {
    return { error };
  }
};

const UserService = {
  initService,
  getUserList,
  getUser,
  getRoles,
  create,
  update,
  remove,
};

module.exports = UserService;
