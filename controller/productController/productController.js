const Product = require("../../model/Product");
const Brand = require("../../model/Brand");
const Category = require("../../model/Category");
const customError = require("../../utils/customError");
const Subcategory = require("../../model/Subcategory");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const queryBuilder = require("../../utils/queryBuilder");

// @desc Add new Product
// @route POST /products/add-product
// @access Private
const addProduct = asyncErrorHandler(async (req, res, next) => {
  const {
    brand,
    cat,
    subcat,
    pname,
    price,
    warranty,
    origin,
    stock,
    desc,
    info,
    varient,
  } = req.body;
  //find if Brand exists
  console.log(req.body);

  const parsePrice = JSON.parse(price);
  const parseVarient = JSON.parse(varient);
  const parseInfo = JSON.parse(info);
  console.log(parseVarient);
  console.log(parseInfo);
  console.log(parsePrice);
  const foundBrand = await Brand.findById(brand)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundBrand) {
    const err = new customError(404, "No Brand exists for this product");
    return next(err);
  }
  //find if category exists
  const foundCategory = await Category.findById(cat)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundCategory) {
    const err = new customError(404, "No category exists for this product");
    return next(err);
  }
  //find if subcategory exists
  const foundSubCategory = await Subcategory.findById(subcat)
    .select({ _id: 1 })
    .lean()
    .exec();
  if (!foundSubCategory) {
    const err = new customError(404, "No Subcategory exists for this product");
    return next(err);
  }
  //find if Product already exists for the brand.
  const foundProduct = await Product.findOne(
    { $and: [{ brand: foundBrand._id }, { pname }] },
    { _id: 1 }
  )
    .lean()
    .exec();

  if (foundProduct) {
    const err = new customError(409, "Product already exists for this brand");
    return next(err);
  }
  //add new product
  let data = {};
  if (req.file) {
    data.image = req.file.location;
  }
  const newProduct = new Product({
    brand,
    cat,
    subcat,
    pname,
    price: parsePrice,
    warranty,
    origin,
    stock,
    desc,
  });
  if (info?.length) {
    newProduct.info = parseInfo;
  }
  if (varient?.length) {
    newProduct.varient = parseVarient;
  }
  if (data?.image) {
    newProduct.pimg = data.image;
  }
  await newProduct.save();
  return res.status(201).json({ message: "New product added successfully" });
});

// @desc Delete  Product
// @route DELETE /products/delete-product
// @access Private
const deleteProduct = asyncErrorHandler(async (req, res) => {
  const { _id } = req.body;
  const deletedProduct = await Product.deleteOne({ _id });
  if (deletedProduct.deletedCount === 0) {
    return res.status(400).json({ message: "Product deletion failed" });
  }
  return res.status(200).json({ message: "Product deleted successfully" });
});

// @desc Update Product
// @route POST /products/update-product
// @access Private
const updateProduct = asyncErrorHandler(async (req, res) => {
  const { _id, pname, price, warranty, stock, desc } = req.body;
  const updatedDetails = {
    pname,
    price,
    warranty,
    stock,
    desc,
  };
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id },
    { ...updatedDetails },
    { new: true, runValidators: true }
  );
  if (Object.values(updatedProduct).length) {
    return res.status(200).json({ message: "Product updated successfully" });
  } else {
    return res.status(400).json({ message: "Product updation failed" });
  }
});

// @desc Get all Products
// @route GET /products/
// @access Private
const getProducts = asyncErrorHandler(async (req, res) => {
  const { query, sort } = queryBuilder(req);
  console.log("Query", query);
  console.log("Sort", sort);
  const allProducts = await Product.find(query)
    .sort(sort)
    .populate({
      path: "cat",
      select: { cname: 1 },
    })
    .populate({ path: "brand", select: { bname: 1, bimg: 1 } })
    .populate({ path: "subcat", select: { scname: 1 } })
    .lean()
    .exec();
  if (!allProducts.length) {
    return res.status(204).json({ message: "No products found" });
  }
  return res.status(200).json(allProducts);
});

//// @desc Get  Brand-Products-Distribution
// @route GET /products/distribution/
// @access Private
const getBPDistribution = asyncErrorHandler(async (req, res) => {
  console.log("I ran");
  console.log("Body", req.body);
  const distributionData = await Product.aggregate([
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand_data",
      },
    },
    {
      $group: {
        _id: "$brand_data.bname",
        ptotal: {
          $sum: 1,
        },
      },
    },
  ]).exec();
  console.log(distributionData);
  if (distributionData.length) {
    return res.status(200).json(distributionData);
  } else {
    return res.status(204).json({ message: "Empty data" });
  }
});

// @desc Get a Product
// @route GET /products/:productId
// @access Private
const getProduct = asyncErrorHandler(async (req, res) => {
  const { productId } = req.params;
  const singleProduct = await Product.findOne({ _id: productId })
    .populate({
      path: "cat",
      select: { cname: 1 },
    })
    .populate({ path: "brand", select: { bname: 1, bimg: 1 } })
    .populate({ path: "subcat", select: { scname: 1 } })
    .lean()
    .exec();
  if (!singleProduct) {
    return res.status(204).json({ message: "No product found" });
  }
  return res.status(200).json(singleProduct);
});

module.exports = {
  getProducts,
  deleteProduct,
  addProduct,
  updateProduct,
  getBPDistribution,
  getProduct,
};
