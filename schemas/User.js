const Joi = require("joi");

const UserCreateSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const UserUpdateSchema = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  roles: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  UserCreateSchema,
  UserUpdateSchema,
};
