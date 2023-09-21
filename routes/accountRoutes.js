const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const upload = require("../middleware/multerS3");
const rateLimit = require("../middleware/rateLimiter");
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
} = require("../controller/accountsController/accountsController");
const {
  addWish,
  deleteWish,
  getWishlistItems,
} = require("../controller/wishlistController/wishlistController");
const { updateAccountValidate } = require("../middleware/JOI/indexValidate");

//Limit requests from IP
router.use(rateLimit);
router.use(accessAuth);

router.route("/").get(authorizeRole([process.env.ADMIN_ROLE]), getUsers);
router
  .route("/ban-user")
  .patch(authorizeRole([process.env.ADMIN_ROLE]), banUser);
router
  .route("/unban-user")
  .patch(authorizeRole([process.env.ADMIN_ROLE]), unbanUser);
router
  .route("/delete-user")
  .delete(authorizeRole([process.env.ADMIN_ROLE]), deleteUser);
router
  .route("/update-user")
  .patch(
    authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]),
    upload.single("dp"),
    updateAccountValidate,
    updateUser
  );
router
  .route("/:uid")
  .get(authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]), getUser);
router
  .route("/:userId/wishlist/add-wish/")
  .post(
    authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]),
    addWish
  );
router
  .route("/:userId/wishlist/delete-wish/")
  .delete(
    authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]),
    deleteWish
  );
router
  .route("/:userId/wishlist/")
  .get(
    authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]),
    getWishlistItems
  );

module.exports = router;
