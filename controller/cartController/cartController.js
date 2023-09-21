const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const customError = require("../../utils/customError");
const CartItem = require("../../model/CartItem");
const Product = require("../../model/Product");
const User = require("../../model/User");
const Cart = require("../../model/Cart");

// @desc Create Cart
// @route POST /cart/create-cart
// @access Private
const createCart = asyncErrorHandler(async (req, res, next) => {
  //create a cart for a user
  const { userId } = req.body;
  const foundUser = await User.findById(userId)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "User does not exist");
    return next(err);
  }
  const foundCart = await Cart.findOne({ userId: userId }).lean().exec();
  if (foundCart) {
    return res.status(200).json({ cartId: foundCart._id });
  }
  const newCart = await Cart.create({ userId: userId });
  return res.status(200).json({ cartId: newCart._id });
});

// @desc Delete Cart
// @route DELETE /cart/empty-cart/:cartId
// @access Private
const emptyCart = asyncErrorHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const foundCart = await Cart.findById(cartId).lean().exec();
  if (!foundCart) {
    const err = new customError(404, "Cart does not exist");
    return next(err);
  }
  await CartItem.deleteMany({ cartId: cartId });
  return res.status(200).json({ message: "Cart emptied successfully" });
});

// @desc Get Cart Items
// @route POST /cart/
// @access Private
const getCart = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;
  const foundUser = await User.findById(userId)
    .select({ _id: 1 })
    .lean()
    .exec();
  //check for valid user
  if (!foundUser) {
    const err = new customError(404, "Invalid User Access for Cart");
    return next(err);
  }
  //check if cart exists
  const foundCart = await Cart.findOne({ userId: foundUser._id });
  if (!foundCart) {
    const err = new customError(404, "Invalid Cart/Cart does not exist");
    return next(err);
  }
  //get all cart items
  const cartItems = await CartItem.find({ cartId: foundCart._id })
    .populate({
      path: "productId",
      populate: {
        path: "brand",
        select: { bname: 1, _id: 0 },
      },
      select: { _id: 1, pname: 1, stock: 1, warranty: 1, pimg: 1, brand: 1 },
    })
    .lean()
    .exec();
  if (!cartItems.length) {
    return res.status(204).json({ message: "Cart is empty" });
  }
  return res.status(200).json(cartItems);
});

// @desc Add item to Cart
// @route PATCH /cart/add-item/
// @access Private
const addCartItem = asyncErrorHandler(async (req, res, next) => {
  const { productId, cartId } = req.query;
  //check if cart exists
  const foundCart = await Cart.findById(cartId);
  if (!foundCart) {
    const err = new customError(204, "Cart does not exist");
    return next(err);
  }
  //find if Product exists
  const foundProduct = await Product.findById(productId);
  if (!foundProduct) {
    const err = new customError(404, "Product not found");
    return next(err);
  }
  //find if product already exists in cart
  const foundCartProduct = await CartItem.findOne({
    productId: productId,
    cartId: cartId,
  })
    .lean()
    .exec();
  if (foundCartProduct) {
    const err = new customError(409, "Product already added to cart");
    return next(err);
  }
  //add product to cart
  await CartItem.create({
    productId: productId,
    cartId: cartId,
    price: foundProduct.price.amount,
    currency: foundProduct.price.currency,
  });
  return res.status(200).json({ message: "Item added to cart successfully" });
});

// @desc Increment items count
// @route PATCH /cart/inc-item/
// @access Private
const incCartItem = asyncErrorHandler(async (req, res, next) => {
  const { productId, cartId } = req.query;
  //check if cart exists and product exists then inc count
  const incCount = await CartItem.findOneAndUpdate(
    {
      productId: productId,
      cartId: cartId,
    },
    { $inc: { quantity: 1 } },
    { new: true, runValidators: true }
  )
    .lean()
    .exec();
  if (Object.values(incCount).length) {
    return res.status(200).json({ message: "Quantity incremented" });
  } else {
    const err = new customError(400, "Quantity incrementation failed");
    return next(err);
  }
});

// @desc Decrement items count
// @route PATCH /cart/dec-item/
// @access Private
const decCartItem = asyncErrorHandler(async (req, res, next) => {
  const { productId, cartId } = req.query;
  //check if cart exists and product exists then dec count
  const decCount = await CartItem.findOneAndUpdate(
    {
      productId: productId,
      cartId: cartId,
    },
    { $inc: { quantity: -1 } },
    { new: true, runValidators: true }
  )
    .lean()
    .exec();
  if (Object.values(decCount).length) {
    return res.status(200).json({ message: "Quantity decremented" });
  } else {
    const err = new customError(400, "Quantity decrementation failed");
    return next(err);
  }
});

// @desc Delete cart item
// @route DELETE /cart/del-item/
// @access Private
const delCartItem = asyncErrorHandler(async (req, res, next) => {
  const { productId, cartId } = req.query;
  //check if cart exists and product exists then del product/cart-item
  const delItem = await CartItem.findOneAndDelete({
    productId: productId,
    cartId: cartId,
  });
  if (Object.values(delItem).length) {
    return res.status(200).json({ message: "Cart Item Deleted" });
  } else {
    const err = new customError(400, "Item deletion failed");
    return next(err);
  }
});

module.exports = {
  createCart,
  emptyCart,
  getCart,
  addCartItem,
  delCartItem,
  incCartItem,
  decCartItem,
};
