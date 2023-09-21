const Joi = require("joi");

const SubCategorySchema = Joi.object({
  scname: Joi.string()
    .min(3)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z]+$/))
    .required(),
  cat: Joi.string().required(),
});

module.exports = SubCategorySchema;
