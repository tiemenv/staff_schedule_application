const { ScheduleCreateSchema, ScheduleUpdateSchema } = require("../schemas/Schedule");
const ScheduleService = require("../services/ScheduleService");

exports.createSchedule = async (req, res) => {
  const { error: validationError } = ScheduleCreateSchema.validate(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError.message });
  }
  const { hours, userId } = req.body;
  const start = new Date(req.body.start);
  const { schedule, error } = await ScheduleService.create({ start, hours, userId });

  if (error) {
    switch (error) {
      case "USER_NOT_FOUND":
        return res.status(400).send({ message: "User not found" });
      case "SCHEDULE_CONFLICT":
        return res.status(400).send({ message: "Scheduling conflict" });
      default:
        return res.status(500).send({ message: "Error while trying to create schedule" });
    }
  }

  return res.status(201).send({ schedule });
};

exports.getSchedules = async (req, res) => {
  const { userId } = req.params;
  let { searchFrom, searchTill } = req.query;
  if (searchFrom) {
    searchFrom = new Date(parseInt(searchFrom, 10));
  }
  if (searchTill) {
    searchTill = new Date(parseInt(searchTill, 10));
  }
  const { schedules, error } = await ScheduleService.getForUser({
    userId, searchFrom, searchTill,
  });

  if (error) {
    switch (error) {
      case "NO_SCHEDULES_FOUND":
        return res.status(404).send({ message: "No schedules found" });
      default:
        return res.status(500).send({ message: "Error while trying to retrieve schedules" });
    }
  }

  return res.status(200).send({ schedules });
};

exports.updateSchedule = async (req, res) => {
  const { error: validationError } = ScheduleUpdateSchema.validate(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError.message });
  }
  const { scheduleId } = req.params;
  const { start, hours, userId } = req.body;
  const { schedule, error } = await ScheduleService.update({
    start, hours, userId, scheduleId,
  });

  if (error) {
    switch (error) {
      case "SCHEDULE_CONFLICT":
        return res.status(400).send({ message: "Scheduling conflict" });
      default:
        return res.status(500).send({ message: "Error while trying to update schedule" });
    }
  }
  return res.status(200).send({ schedule });
};

exports.deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const { error } = await ScheduleService.remove({ scheduleId });
  if (error) {
    switch (error) {
      case "SCHEDULE_NOT_FOUND":
        return res.status(400).send({ message: "Schedule not found" });
      default:
        return res.status(500).send({ message: "Error while trying to delete schedule" });
    }
  }
  return res.status(200).send({ message: "Schedule deleted" });
};
