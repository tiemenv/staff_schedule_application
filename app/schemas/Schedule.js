const Joi = require("joi");

const ScheduleCreateSchema = Joi.object({
  start: Joi.date().required(),
  hours: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
});

const ScheduleUpdateSchema = Joi.object({
  start: Joi.date().optional(),
  hours: Joi.number().integer().optional(),
  userId: Joi.number().integer().optional(),
});

module.exports = {
  ScheduleCreateSchema,
  ScheduleUpdateSchema,
};
