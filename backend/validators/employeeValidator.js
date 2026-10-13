const Joi = require("joi");

const createEmployeeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),

  email: Joi.string().trim().email().required(),

  password: Joi.string().min(8).max(128).required(),

  department: Joi.string().trim().min(2).max(60).required(),

  designation: Joi.string().trim().min(2).max(60).required(),

  phone: Joi.string().trim().allow("").optional(),

  address: Joi.string().trim().allow("").optional(),

  joiningDate: Joi.date().optional(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),

  email: Joi.string().trim().email(),

  department: Joi.string().trim().min(2).max(60),

  designation: Joi.string().trim().min(2).max(60),

  phone: Joi.string().trim().allow(""),

  address: Joi.string().trim().allow(""),

  joiningDate: Joi.date().allow(null),

  isActive: Joi.boolean(),
}).min(1);
module.exports = { createEmployeeSchema,updateEmployeeSchema };