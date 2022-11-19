/**
 * We can mock the implementation of the MySQL repo here for test purpose
 * or we can use an npm module such as sequelize-mock
 */
// const db = [
//   {
//     startTime: 1,
//     endTime: 2,
//     userId: 3,
//   },
// ];

// const findBetweenDates = (startTime, endTime, userId) => {
//   return db.find((row) => {
//     if (row.userId !== userId) {
//       return false;
//     };
//     if (startTime => row.startTime && startTime <= row.endTime) {
//       return true;
//     } else if (endTime => row.startTime && endTime <= row.endTime) {
//       return true;
//     }
//     return false;
//   });
// };

// const ScheduleMysqlRepo = {
//   findBetweenDates,
// }

// module.exports = ScheduleMysqlRepo;
