const Joi = require("joi");

const ProductSchema = Joi.object({
  brand: Joi.string().required(),
  cat: Joi.string().required(),
  subcat: Joi.string().required(),
  pname: Joi.string()
    .min(3)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z]+$/))
    .required(),
  warranty: Joi.string().trim().required(),
  origin: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  desc: Joi.string().min(10).max(200).trim().required(),
  price: Joi.string().required(),
  info: Joi.string(),
  pimg: Joi.string().allow(null, ""),
  varient: Joi.string(),
});

module.exports = ProductSchema;
