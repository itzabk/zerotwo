const Wishlist = require("../../model/Wishlist");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const customError = require("../../utils/customError");
const User = require("../../model/User");
const Product = require("../../model/Product");

// @desc  Product to Wishlist
// @route  POST /account/wishlist/add-wish/:userId
// @access Private
const addWish = asyncErrorHandler(async (req, res, next) => {
  const { userId, productId } = req.body;
  //find if user exists
  const foundUser = await User.findById(userId)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "User does not exist");
    return next(err);
  }
  //find if Product exists
  const foundProduct = await Product.findById(productId);
  if (!foundProduct) {
    const err = new customError(404, "Product not found");
    return next(err);
  }
  //check if product already exists in wishlist
  const foundWish = await Wishlist.findOne({
    productId: productId,
    userId: userId,
  })
    .lean()
    .exec();
  if (foundWish) {
    const err = new customError(409, "Product already added to Wishlist");
    return next(err);
  }
  //if user and product exists then create a new wish
  await Wishlist.create({
    userId: userId,
    productId: productId,
  });
  return res.status(200).json({ message: "Item added to Wishlist" });
});

// @desc Delete Product from Wishlist
// @route DELETE /account/wishlist/delete-wish/:userId
// @access Private
const deleteWish = asyncErrorHandler(async (req, res, next) => {
  const { userId, productId } = req.body;
  //find if user exists
  const foundUser = await Wishlist.findOne({ userId: userId })
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "Wishlist does not exists for this User");
    return next(err);
  }
  const deletedWish = await Wishlist.deleteOne({
    userId: userId,
    productId: productId,
  })
    .lean()
    .exec();
  //send deletion message
  if (deletedWish.deletedCount === 1) {
    return res.status(200).json({ message: "Item deleted from Wishlist" });
  } else {
    const err = new customError(400, "Item deletion failed");
    return next(err);
  }
});

// @desc Get all Wishlisted Products
// @route  GET /account/wishlist/:userId
// @access Private
const getWishlistItems = asyncErrorHandler(async (req, res) => {
  const { userId } = req.params;
  //find if user exists
  const foundUser = await User.findById(userId)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "User does not exist");
    return next(err);
  }
  const wishlist = await Wishlist.find({ userId: userId })
    .populate({
      path: "productId",
      select: { pname: 1, price: 1, origin: 1, pimg: 1, brand: 1, warranty: 1 },
    })
    .populate({
      path: "productId.brand",
      select: { bname: 1 },
    })
    .lean()
    .exec();
  return res.status(200).json(wishlist);
});

module.exports = { addWish, deleteWish, getWishlistItems };
