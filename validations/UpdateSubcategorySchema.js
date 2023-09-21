const Joi = require("joi");

const UpdateSubCategorySchema = Joi.object({
  scname: Joi.string()
    .min(3)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z]+$/))
    .required(),
  _id: Joi.string().required(),
});

module.exports = UpdateSubCategorySchema;
