const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = new mongoose.Schema(
  {
    cname: {
      type: String,
      validate: [validator.isAlpha, "Only letter(s) allowed for Category name"],
      trim: true,
      required: true,
      minlength: [3, "Category name must be atleast 3 characters long"],
      unique: true,
    },
  },
  { timestamps: true }
);

//Capitalize first letter
categorySchema.pre("save", function (next) {
  this.cname =
    this.cname.charAt(0).toUpperCase() + this.cname.slice(1).toLowerCase();
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
