const mongoose = require("mongoose");
const validator = require("validator");

const subCategorySchema = new mongoose.Schema(
  {
    cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    scname: {
      type: String,
      validate: [validator.isAlpha, "Only letter(s) allowed for Subcategory name"],
      trim: true,
      required: true,
      minlength: [3, "Subcategory name must be atleast 3 characters long"],
      unique: true,
    },
  },
  { timestamps: true }
);

//Capitalize first letter
subCategorySchema.pre("save", function (next) {
  this.scname =
    this.scname.charAt(0).toUpperCase() + this.scname.slice(1).toLowerCase();
  next();
});

const Subcategory = mongoose.model("Subcategory", subCategorySchema);

module.exports = Subcategory;
