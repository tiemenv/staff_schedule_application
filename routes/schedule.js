const { verifyToken, requireAdmin } = require("../middleware/jwtAuth");
const controller = require("../contollers/schedule");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    );
    next();
  });

  // see schedule for a given user
  app.get(
    "/users/:userId/schedules",
    [verifyToken],
    controller.getSchedules,
  );

  // create a schedule
  app.post(
    "/schedules",
    [
      verifyToken,
      requireAdmin,
    ],
    controller.createSchedule,
  );

  // update schedule
  app.put(
    "/schedules/:scheduleId",
    [
      verifyToken,
      requireAdmin,
    ],
    controller.updateSchedule,
  );

  // delete schedule
  app.delete(
    "/schedules/:scheduleId",
    [
      verifyToken,
      requireAdmin,
    ],
    controller.deleteSchedule,
  );
};
