const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),

  phone: Joi.string().trim().allow(""),

  address: Joi.string().trim().allow(""),
}).min(1);

module.exports = { updateProfileSchema };