const { isNil, isEmpty } = require("ramda");
const { Op } = require("sequelize");
const db = require("./models");

const User = db.user;
const Schedule = db.schedule;

/**
 *
 * @param {Object} options
 * @param {number} options.userId
 * @param {boolean} [options.raw]
 * @returns {Promise}
 */
const findById = async ({ userId, raw = false }) => {
  const user = await User.findByPk(userId, { raw });
  // returns either Model or user object
  return user;
};

/**
 *
 * @param {Object} options
 * @param {number} options.username
 * @param {boolean} [options.raw]
 * @returns {Promise}
 */
const findByUsername = async ({ username, raw = false }) => {
  const user = await User.findOne({
    where: {
      username,
    },
    raw,
  });
  // returns either Model or user object
  return user;
};

const getUsersOrderedByHoursScheduled = async ({ searchFrom, searchTill }) => {
  const queryHelperObject = {};
  // TODO: there is probably a better way of doing this
  if (searchFrom && searchTill) {
    queryHelperObject.start = {
      [Op.between]: [searchFrom, searchTill],
    };
  } else if (searchFrom) {
    queryHelperObject.start = {
      [Op.gte]: searchFrom,
    };
  } else if (searchTill) {
    queryHelperObject.start = {
      [Op.lte]: searchTill,
    };
  }
  const users = await User.findAll({
    include: [{
      model: Schedule,
      attributes: [],
      where: queryHelperObject,
    }],
    attributes: ["id", "username", [db.sequelize.fn("sum", db.sequelize.col("schedules.hours")), "totalHours"]],
    group: ["users.id"],
  });
  return users;
};

const getUserRoles = async ({ userId }) => {
  const user = await User.findByPk(userId);
  const roles = await user.getRoles({ raw: true });
  return roles;
};

/**
 *
 * @param {Object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.hours
 * @param {number} options.userId
 * @returns {Promise}
 */
const insert = async ({
  username,
  password,
}) => {
  // insert schedule document
  // couple it to user

  const user = await User.create({
    username,
    password,
  });

  // TODO: remove automatic admin role, just for easier testing
  await user.setRoles([1, 2]);
  return user.dataValues;
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
  userId, username, password, roles
}) => {
  const user = await findById({ userId });
  if (isNil(user.dataValues) || isEmpty(user.dataValues)) {
    return { error: "USER_NOT_FOUND" };
  }
  user.set({
    username,
    password,
    roles,
  });

  await user.save();
  return user.dataValues;
};

/**
 *
 * @param {Object} options
 * @param {number} options.userId
 * @returns {Promise}
 */
const remove = async ({ userId }) => {
  const user = await findById({ userId });
  if (isNil(user?.dataValues) || isEmpty(user?.dataValues)) {
    return { error: "USER_NOT_FOUND", success: false };
  }
  await user.destroy();
  return { success: true };
};

const UserMySqlRepo = {
  getUsersOrderedByHoursScheduled,
  getUserRoles,
  findById,
  findByUsername,
  insert,
  update,
  remove,
};

module.exports = UserMySqlRepo;
