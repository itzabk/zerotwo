const Joi = require("joi");

const PasswordResetSchema = Joi.object({
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%*])[A-Za-z\d@$#!%*?&]{8,}$/
      )
    )
    .trim()
    .required(),
});

module.exports = PasswordResetSchema;
