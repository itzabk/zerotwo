const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    minlength: [8, "Comment should be minimum 8 characters long"],
    maxlength: [200, "Comment can be maximum 200 characters long"],
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
