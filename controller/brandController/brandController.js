const Brand = require("../../model/Brand");
const Product = require("../../model/Product");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");

// @desc Create new Brand
// @route POST /brands/add-brand
// @access Private
const createBrand = asyncErrorHandler(async (req, res) => {
  const { bname } = req.body;
  console.log(bname);
  let data = {};
  if (req.file) {
    data.image = req.file.location;
  }
  console.log(data)
  //Add new brand
  const newBrand = new Brand({ bname: bname });
  if (data?.image) {
    newBrand.bimg = data.image;
  }
  await newBrand.save();
  //return success
  return res.status(201).json({ message: "New Brand created successfully" });
});

// @desc Delete Brand
// @route DELETE /brands/delete-brand
// @access Private
const deleteBrand = asyncErrorHandler(async (req, res) => {
  const { bname } = req.body;
  //find brand in db
  const foundBrand = await Brand.findOne({ bname }).lean().exec();
  if (!foundBrand) {
    return res.status(400).json({ message: "Brand does not exists" });
  }
  //delete brand
  await Product.deleteMany({ brand: foundBrand._id });
  const deletedBrand = await Brand.deleteOne({ bname: foundBrand.bname });
  if (deletedBrand.deletedCount === 1) {
    return res.status(200).json({ message: "Brand Deleted Successfully" });
  } else {
    return res.status(400).json({ message: "Delete operation failed" });
  }
});

// @desc Get all Brands
// @route GET /brands/
// @access Private
const getAllBrands = asyncErrorHandler(async (req, res) => {
  const allBrands = await Brand.find({}).lean().exec();
  if (!allBrands.length) {
    return res.status(204).json({ message: "No brands exists" });
  }
  return res.status(200).json(allBrands);
});

module.exports = { createBrand, deleteBrand, getAllBrands };
