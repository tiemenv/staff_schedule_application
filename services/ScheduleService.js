const { isNil, isEmpty } = require("ramda");
const { addHoursToDate, addYearsToDate } = require("../utils/addTimeToDate");
const UserService = require("./UserService");

let _repo = null;

// REPO
/**
 * REPO methods NAME should be ABOUT operation with DBs such as insert, find, delete, ec..
 * REPO methods NAME must NEVER have business logic names, such as isTimeSlotAvailable
 * REPO has JUST database OPS (queries, mutations)
 */

const initService = (scheduleRepository) => {
  _repo = scheduleRepository;
};

/**
 *
 * @param {Object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.userId
 * @param {number} [options.excludeScheduleId]
 * @returns {Promise<boolean>}
 */
const isTimeSlotAvailable = async ({
  start, end, userId, excludeScheduleId,
}) => {
  const { schedule } = await _repo.findBetweenDates({
    start, end, userId, excludeScheduleId,
  });
  // if no schedule is found, that means the timeslot is available
  return isNil(schedule) || isEmpty(schedule);
};

/**
 *
 * @param {Object} options
 * @param {number} options.userId
 * @param {Date} [options.searchFrom]
 * @param {Date} [options.searchTill]
 * @returns {Promise}
 */
const getForUser = async ({ userId, searchFrom, searchTill }) => {
  try {
    // allow max 1 year in future
    if (
      isNil(searchTill)
      || isEmpty(searchTill)
      || addYearsToDate({ numberOfYears: 1, date: searchTill }) > searchTill
    ) {
      // TODO:
      searchTill = addYearsToDate({ numberOfYears: 1, date: new Date() });
    }
    const { schedules } = await _repo.findByUser({ userId, searchFrom, searchTill });
    if (isNil(schedules) || isEmpty(schedules)) {
      return { error: "NO_SCHEDULES_FOUND" };
    }
    return { schedules };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.userId
 * @returns {Object} response
 * @returns {Schedule} [response.schedule]
 * @returns {string} [response.error]
 */
const create = async ({ start, hours, userId }) => {
  const end = addHoursToDate({ numberOfHours: hours, date: start });
  try {
    // this enforces that we always check availabilty BEFORE inserting
    const isSlotAvailable = await isTimeSlotAvailable({ start, end, userId });
    if (!isSlotAvailable) {
      return { error: "SCHEDULE_CONFLICT" };
    }
    // check if user exists
    const { user, error: getUserError } = await UserService.getUser({ userId });
    if (getUserError) {
      return { error: getUserError };
    }
    if (!user) {
      return { error: "USER_NOT_FOUND" };
    }
    const schedule = await _repo.insert({
      start,
      hours,
      end,
      userId,
    });
    if (isNil(schedule) || isEmpty(schedule)) {
      return { error: "CREATE_SCHEDULE_ERROR" };
    }
    return { schedule };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @param {number} options.userId
 * @returns {Object} response
 * @returns {Schedule} [response.schedule]
 * @returns {string} [response.error]
 */
const update = async ({
  start, hours, userId, scheduleId,
}) => {
  const end = addHoursToDate({ numberOfHours: hours, date: start });
  try {
    // TODO: little awkward to check time slot availability before even checking if the schedule id exists
    const isSlotAvailable = await isTimeSlotAvailable({
      start, end, userId, excludeScheduleId: scheduleId
    });
    if (!isSlotAvailable) {
      return { error: "SCHEDULE_CONFLICT" };
    }
    const schedule = await _repo.update({
      scheduleId,
      start,
      hours,
      end,
      userId,
    });
    return { schedule };
  } catch (error) {
    return { error };
  }
};

/**
 *
 * @param {Object} options
 * @param {number} options.scheduleId
 * @returns {Object} response
 */
const remove = async ({ scheduleId }) => {
  // depending on business requirements, we might want to prevent removing past schedules
  // but for now, assume out of scope
  try {
    const { success, error } = await _repo.remove({
      scheduleId,
    });
    return { success, error };
  } catch (error) {
    return { error };
  }
};

const ScheduleService = {
  initService,
  getForUser,
  create,
  update,
  remove,
};

module.exports = ScheduleService;
