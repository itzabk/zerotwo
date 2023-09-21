const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Paid", "paid", "unpaid", "Unpaid"],
      required: true,
    },
    payment_no: {
      type: String,
    },
    payment_amt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function () {
  this.payment_amt = this.payment_amt / 100;
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
