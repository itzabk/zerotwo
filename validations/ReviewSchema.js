const Joi = require("joi");

const ReviewSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().min(8).max(200),
});

module.exports = ReviewSchema;
