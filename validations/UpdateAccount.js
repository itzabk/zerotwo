const Joi = require("joi");

const UpdateAccount = Joi.object({
  _id: Joi.string(),
  dob: Joi.string(),
  address: Joi.string(),
  nickname: Joi.string(),
  dp: Joi.string(),
});

module.exports = UpdateAccount;
