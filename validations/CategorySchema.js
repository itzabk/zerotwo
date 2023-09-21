const Joi = require("joi");

const CategorySchema = Joi.object({
  cname: Joi.string()
    .min(3)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z]+$/))
    .required(),
});

module.exports = CategorySchema;
