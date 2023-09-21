const Subcategory = require("../../model/Subcategory");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const Category = require("../../model/Category");
const customError = require("../../utils/customError");
const Product = require("../../model/Product");
const mongoose = require("mongoose");
const { Types } = mongoose;
const { ObjectId } = Types;

// @desc Create new Sub-Category
// @route POST /subcategories/add-subcategory
// @access Private
const createSubCategory = asyncErrorHandler(async (req, res, next) => {
  const { scname, cat } = req.body;
  //Check if category exists for subcategory
  const foundCategory = await Category.findOne({ _id: cat }).lean().exec();
  if (!foundCategory) {
    const err = new customError(404, "Category not found");
    return next(err);
  }
  //Add new Sub-Category
  await Subcategory.create({ scname, cat });
  //return success
  return res
    .status(201)
    .json({ message: "New Subcategory added successfully" });
});

// @desc Delete Sub-Category
// @route DELETE /subcategories/delete-subcategory
// @access Private
const deleteSubCategory = asyncErrorHandler(async (req, res, next) => {
  const { scname } = req.body;
  //find category in db
  const foundSubCategory = await Subcategory.findOne({ scname }).lean().exec();
  if (!foundSubCategory) {
    const err = new customError(400, "Sub-Category does not exists");
    return next(err);
  }
  //de-subcategorise Product
  const modifiedProd = await Product.updateMany(
    {
      subcat: foundSubCategory._id,
    },
    { $unset: { subcat: 1 } },
    { multi: true }
  );
  //delete category
  const deletedSubCategory = await Subcategory.deleteOne({
    scname: foundSubCategory.scname,
  });
  if (deletedSubCategory.deletedCount === 1) {
    if (process.env.NODE_ENV === "dev") {
      return res.status(200).json({
        message: "Sub-Category Deleted Successfully",
        modifiedSubcatCount: modifiedProd.modifiedCount,
        matchedprodCount: modifiedProd.matchedCount,
      });
    } else if (process.env.NODE_ENV === "prod") {
      return res.status(200).json({
        message: "Sub-Category Deleted Successfully",
      });
    }
  } else {
    const err = new customError(400, "Delete operation failed");
    return next(err);
  }
});

// @desc Get a Sub-Category
// @route POST /subcategories/
// @access Private
const getASubCategory = asyncErrorHandler(async (req, res, next) => {
  const { catId } = req.body;
  //check if category exists
  const foundCategory = await Category.findById(catId);
  if (!foundCategory) {
    const err = new customError(404, "No Catgeory found");
    return next(err);
  }
  const allSubCategories = await Subcategory.find({ cat: catId }).lean().exec();
  if (!allSubCategories.length) {
    const err = new customError(404, "No Subcategory exists");
    return next(err);
  }
  return res.status(200).json(allSubCategories);
});

// @desc Get a Sub-Category
// @route GET /subcategories/all-sub
// @access Public
const getAllSubcategories = asyncErrorHandler(async (req, res, next) => {
  const allSubCategories = await Subcategory.find({}).lean().exec();
  if (!allSubCategories.length) {
    return res.status(204).json({ message: "No subcategory exists" });
  }
  return res.status(200).json(allSubCategories);
});

module.exports = {
  createSubCategory,
  deleteSubCategory,
  getASubCategory,
  updateSubCategory,
  getAllSubcategories,
};
