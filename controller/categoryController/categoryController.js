const Category = require("../../model/Category");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const Subcategory = require("../../model/Subcategory");
const Product = require("../../model/Product");

// @desc Create new Category
// @route POST /categories/add-category
// @access Private
const createCategory = asyncErrorHandler(async (req, res, next) => {
  const { cname } = req.body;
  //Add new Category
  await Category.create({ cname });
  //return success
  return res.status(201).json({ message: "New Category created successfully" });
});

// @desc Delete Category
// @route DELETE /categories/delete-category
// @access Private
const deleteCategory = asyncErrorHandler(async (req, res) => {
  const { cname } = req.body;
  //find category in db
  const foundCategory = await Category.findOne({ cname }).lean().exec();
  if (!foundCategory) {
    return res.status(400).json({ message: "Category does not exists" });
  }
  //Deleted associated subcategories
  await Subcategory.deleteMany({
    cat: foundCategory._id,
  });
  // de-categorize, de-subcategorize registered products
  const modifiedProd = await Product.updateMany(
    {
      cat: foundCategory._id,
    },
    { $unset: { cat: 1, subcat: 1 } },
    { multi: true }
  );
  //delete specified category
  await Category.deleteOne({
    cname: foundCategory.cname,
  });
  if (process.env.NODE_ENV === "dev") {
    return res.status(200).json({
      message: "Category Deleted Successfully",
      modifiedProductCount: modifiedProd.modifiedCount,
      matchedProductCount: modifiedProd.matchedCount,
    });
  } else if (process.env.NODE_ENV === "prod") {
    return res.status(200).json({
      message: "Category Deleted Successfully",
    });
  }
});

// @desc Get all Categories
// @route GET /categories/
// @access Public
const getAllCategories = asyncErrorHandler(async (req, res) => {
  const allCategories = await Category.find({}).lean().exec();
  if (!allCategories.length) {
    return res.status(204).json({ message: "No category exists" });
  }
  return res.status(200).json(allCategories);
});

// @desc Update a Category
// @route PATCH /categories/update-category
// @access Private
const updateCategory = asyncErrorHandler(async (req, res) => {
  const { _id, newname } = req.body;
  const foundCategory = await Category.findById(_id);
  if (!foundCategory) {
    return res.status(404).json({ message: "Category is not found" });
  }
  //update the category
  const updatedCategory = await Category.updateOne(
    { _id: foundCategory._id },
    { $set: { cname: newname } },
    { runValidators: true }
  );
  console.log(updatedCategory);
  if (updatedCategory.modifiedCount === 1) {
    return res.status(200).json({ message: "Category updated successfully" });
  } else {
    return res.status(400).json({ message: "Category updation failed" });
  }
});

module.exports = {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
};
