const Order = require("../../model/Order");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const customError = require("../../utils/customError");
const User = require("../../model/User");

// @desc Get Customer Order
// @route GET /orders/:userId
// @access Private
const getOrder = asyncErrorHandler(async (req, res) => {
  const { userId } = req.params;
  const foundUser = await User.findById(userId)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "User does not exist");
    return next(err);
  }
  const userOrders = await Order.find({ userId: userId }).lean().exec();
  if (userOrders.length > 0) {
    return res.status(200).json(userOrders);
  } else {
    return res.status(201).json({ message: "No orders exist for user" });
  }
});

// @desc Get All Customer Orders
// @route GET /orders/
// @access Private
const getOrders = asyncErrorHandler(async (req, res) => {
  const userOrders = await Order.find({}).lean().exec();
  if (userOrders.length > 0) {
    return res.status(200).json(userOrders);
  } else {
    return res.status(201).json({ message: "No orders exist" });
  }
});

module.exports = { getOrder, getOrders };
