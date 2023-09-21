const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    bname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bimg: {
      type: String,
    },
  },
  { timestamps: true }
);

//Capitalize first letter
brandSchema.pre("save", function (next) {
  if (this.bname.length > 1) {
    this.bname =
      this.bname.charAt(0).toUpperCase() + this.bname.slice(1).toLowerCase();
  } else {
    this.bname.toUpperCase();
  }
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
