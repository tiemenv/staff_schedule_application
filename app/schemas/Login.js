const Joi = require("joi");

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = LoginSchema;
