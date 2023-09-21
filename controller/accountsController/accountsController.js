const User = require("../../model/User");
const customError = require("../../utils/customError");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");

//@desc Get all Users
//@route GET /account/
//@access Private
const getUsers = asyncErrorHandler(async (req, res, next) => {
  const foundUsers = await User.find({}).select({ password: 0 }).lean().exec();
  if (!foundUsers.length) {
    const err = new customError(404, "No Users Found");
    return next(err);
  }
  return res.status(200).json(foundUsers);
});

//@desc Get a User
//@route GET /account/:uid
//@access Private
const getUser = asyncErrorHandler(async (req, res, next) => {
  const { uid } = req.params;
  const foundUser = await User.findById(uid)
    .select({ password: 0 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "No User Found");
    return next(err);
  }
  return res.status(200).json(foundUser);
});

//@desc Delete a User
//@route DELETE /account/delete-user
//@access Private
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.body;
  const foundUser = await User.findById(_id)
    .select({ password: 0 })
    .lean()
    .exec();
  if (!foundUser) {
    const err = new customError(404, "No User Found");
    return next(err);
  }
  const deletedUser = await User.deleteOne({ _id: foundUser._id })
    .lean()
    .exec();
  if (deletedUser.deletedCount === 1) {
    return res.status(200).json({ message: "User deleted successfully" });
  } else {
    const err = new customError(400, "User Deletion Failed");
    return next(err);
  }
});

//@desc Update a User
//@route PATCH /account/update-user
//@access Private
const updateUser = asyncErrorHandler(async (req, res, next) => {
  const { _id, dob, nickname, address } = req.body;
  const parsedAddress = JSON.parse(address);
  let data = {};
  if (req.file) {
    data.image = req.file.location;
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      $set: {
        dob: dob,
        address: parsedAddress,
        nickname: nickname,
        dp: data?.image,
      },
    },
    { new: true, runValidators: true }
  );
  if (Object.values(updateUser).length) {
    return res
      .status(200)
      .json({ message: "User details is updated successfully" });
  } else {
    const err = new customError(400, "User Updation Failed");
    return next(err);
  }
});

//@desc Unban a User
//@route PATCH /account/unban-user
//@access Private
const unbanUser = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.body;
  const unbannedUser = await User.findByIdAndUpdate(
    _id,
    {
      $set: { underBan: false },
    },
    { new: true, runValidators: false }
  );
  if (Object.values(unbannedUser).length) {
    return res.status(200).json({ message: "User is unbanned" });
  } else {
    const err = new customError(400, "Attempting to Ban User Failed");
    return next(err);
  }
});

//@desc Ban a User
//@route PATCH /account/ban-user
//@access Private
const banUser = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.body;
  const bannedUser = await User.findByIdAndUpdate(
    _id,
    {
      $set: { underBan: true },
    },
    { new: true, runValidators: true }
  );
  if (Object.values(bannedUser).length) {
    return res.status(200).json({ message: "User is Banned" });
  } else {
    const err = new customError(400, "Attempting to Ban User Failed");
    return next(err);
  }
});

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
};
