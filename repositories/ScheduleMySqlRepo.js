const { isNil, isEmpty } = require("ramda");
const { Op } = require("sequelize");
const db = require("./models");

const Schedule = db.schedule;
const User = db.user;

/**
 *
 * @param {Object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.userId
 * @param {number} [options.excludeScheduleId]
 * @returns {Promise<Schedule>}
 */
const findBetweenDates = async ({
  start,
  end,
  userId,
  excludeScheduleId,
}) => {
  // TODO: this query and findByUser is almost the same, merge into 1?
  const queryObject = {
    where: {
      userId,
      [Op.or]: {
        start: {
          // between is inclusive
          [Op.between]: [start, end],
        },
        end: {
          [Op.between]: [start, end],
        },
      },
    },
    raw: true,
  };
  if (excludeScheduleId) {
    queryObject.where.id = {
      [Op.ne]: excludeScheduleId,
    };
  }
  const schedule = await Schedule.findOne(queryObject);
  return { schedule };
};

/**
 *
 * @param {Object} options
 * @param {number} options.scheduleId
 * @param {boolean} [options.raw]
 * @returns {Promise<Schedule>}
 */
const findById = async ({ scheduleId, raw = false }) => {
  const schedule = await Schedule.findByPk(scheduleId, { raw });
  return schedule;
};

/**
 *
 * @param {number} userId
 * @param {Date} [searchFrom]
 * @param {Date} [searchTill]
 * @param {number} [excludeScheduleId]
 * @returns {Promise<Array<Schedule>>}
 */
const findByUser = async ({ userId, searchFrom, searchTill }) => {
  const queryObject = {
    where: {
      userId,
    },
    raw: true,
  };
  if (searchFrom && searchTill) {
    queryObject.where.start = {
      [Op.between]: [searchFrom, searchTill],
    };
  } else if (searchFrom) {
    queryObject.where.start = {
      [Op.gte]: searchFrom,
    };
  } else if (searchTill) {
    queryObject.where.start = {
      [Op.lte]: searchTill,
    };
  }
  const schedules = await Schedule.findAll(queryObject);
  // const schedules = result.map((schedule) => schedule.dataValues);

  return { schedules };
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
  start,
  hours,
  end,
  userId,
}) => {
  // insert schedule document
  // couple it to user
  const schedule = await Schedule.create({
    start,
    hours,
    end,
  });

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  const result = await schedule.setUser(user);
  return result.dataValues;
};

/**
 *
 * @param {Object} options
 * @param {number} options.scheduleId
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.hours
 * @param {number} options.userId
 * @returns {Promise}
 */
const update = async ({
  scheduleId, start, hours, end, userId,
}) => {
  const schedule = await findById({ scheduleId, raw: false });
  if (isNil(schedule) || isEmpty(schedule)) {
    return { error: "SCHEDULE_NOT_FOUND" };
  }
  schedule.set({
    start,
    hours,
    end,
    userId,
  });

  await schedule.save();
  return schedule.dataValues;
};

/**
 *
 * @param {Object} options
 * @param {number} options.scheduleId
 * @returns {Promise}
 */
const remove = async ({ scheduleId }) => {
  const schedule = await findById({ scheduleId });
  if (!schedule?.dataValues) {
    return { error: "SCHEDULE_NOT_FOUND", success: false };
  }
  await schedule.destroy();
  return { success: true };
};

const ScheduleMysqlRepo = {
  findBetweenDates,
  findById,
  findByUser,
  insert,
  update,
  remove,
};

module.exports = ScheduleMysqlRepo;
