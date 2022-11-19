/**
 * @param {Object} options
 * @param {number} options.numberOfHours
 * @param {Date} options.date
 * @returns {Date}
 */
const addHoursToDate = ({ numberOfHours, date }) => {
  // copy to prevent side effects
  const newDate = new Date(date);
  newDate.setTime(newDate.getTime() + numberOfHours * 60 * 60 * 1000);

  return newDate;
};

/**
 * @param {Object} options
 * @param {number} options.numberOfYears
 * @param {Date} options.date
 * @returns {Date}
 */
const addYearsToDate = ({ numberOfYears, date }) => {
  // copy to prevent side effects
  const newDate = new Date(date);
  const dateYear = newDate.getFullYear() + numberOfYears;
  newDate.setFullYear(dateYear);

  return newDate;
};

/**
 *
 * @param {Object} options
 * @param {number} options.numberOfHours
 * @param {number} options.timestamp
 * @returns {number}
 */
const addHoursToTimestamp = ({ numberOfHours, timestamp = new Date().getTime() }) =>
  timestamp + numberOfHours * 60 * 60 * 1000;

module.exports = {
  addHoursToDate,
  addYearsToDate,
  addHoursToTimestamp,
};
