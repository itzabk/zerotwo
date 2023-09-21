const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
  },
});

cartItemSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.subtotal = docToUpdate.price * docToUpdate.quantity;
  docToUpdate.save();
});

cartItemSchema.pre("save", function () {
  this.subtotal = this.price * this.quantity;
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
