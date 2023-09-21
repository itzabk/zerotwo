const Joi = require("joi");

const UpdateCategorySchema = Joi.object({
  newname: Joi.string()
    .min(3)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z]+$/))
    .required(),
  _id: Joi.string().required(),
});

module.exports = UpdateCategorySchema;
