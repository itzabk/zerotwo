const CategorySchema = require("../../validations/CategorySchema");
const EmailVerificationSchema = require("../../validations/EmailVerificationSchema");
const UserLoginSchema = require("../../validations/UserLoginSchema");
const PasswordResetSchema = require("../../validations/PasswordResetschema");
const BrandSchema = require("../../validations/BrandSchema");
const ProductSchema = require("../../validations/ProductSchema");
const UserRegisterSchema = require("../../validations/UserRegisterSchema");
const SubcategorySchema = require("../../validations/SubcategorySchema");
const UpdateCategorySchema = require("../../validations/UpdateCategorySchema");
const UpdateSubCategorySchema = require("../../validations/UpdateSubcategorySchema");
const ReviewSchema = require("../../validations/ReviewSchema");
const UpdateAccount = require("../../validations/UpdateAccount");
const genericTemplate = require("./genericValidationTemplate");

const categoryValidate = genericTemplate(CategorySchema);
const emailValidate = genericTemplate(EmailVerificationSchema);
const loginValidate = genericTemplate(UserLoginSchema);
const passwordValidate = genericTemplate(PasswordResetSchema);
const brandValidate = genericTemplate(BrandSchema);
const productValidate = genericTemplate(ProductSchema);
const registerValidate = genericTemplate(UserRegisterSchema);
const subCategoryValidate = genericTemplate(SubcategorySchema);
const updateCategoryValidate = genericTemplate(UpdateCategorySchema);
const updateSubcategoryValidate = genericTemplate(UpdateSubCategorySchema);
const reviewValidate = genericTemplate(ReviewSchema);
const updateAccountValidate = genericTemplate(UpdateAccount);

module.exports = {
  categoryValidate,
  emailValidate,
  loginValidate,
  passwordValidate,
  brandValidate,
  productValidate,
  registerValidate,
  subCategoryValidate,
  updateCategoryValidate,
  updateSubcategoryValidate,
  reviewValidate,
  updateAccountValidate
};
