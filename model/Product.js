const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    pname: {
      type: String,
      required: true,
      validate: [validator.isAlpha, "Only letter(s) allowed for Product name"],
      minlength: [3, "Product must be atleast 3 characters long"],
      trim: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
        min: 1,
      },
      currency: {
        type: String,
        required: true,
        default: "INR",
      },
    },
    warranty: {
      type: String,
      required: true,
    },
    pimg: { type: String, required: true },
    origin: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    desc: {
      type: String,
      required: true,
      minlength: "10",
      maxlength: "200",
      trim: true,
    },
    info: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    varient: [String],
  },
  { timestamps: true }
);

//Capitalize first letter
productSchema.pre("save", function (next) {
  this.pname =
    this.pname.charAt(0).toUpperCase() + this.pname.slice(1).toLowerCase();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
