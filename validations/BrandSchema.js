const Joi = require("joi");

const BrandSchema = Joi.object({
  bname: Joi.string().trim().required(),
  bimg: Joi.string().allow(null, ""),
});

module.exports = BrandSchema;
