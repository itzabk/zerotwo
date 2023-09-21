//require Models
const User = require("../model/User");
//Find if a user with exists and is a verified user
const findUserAndVerify = async (emailId) => {
  try {
    const vUser = await User.aggregate([
      { $match: { email: emailId } },
      {
        $lookup: {
          from: "verifies",
          localField: "email",
          foreignField: "email",
          as: "verifiedUser",
        },
      },
      {
        $unwind: "$verifiedUser",
      },
      {
        $project: { email: 1, eVerified: "$verifiedUser.eVerify", _id: 0 },
      },
    ]);
    if (!vUser.length || !vUser[0]?.eVerified) {
      return false;
    } else if (vUser.length && vUser[0]?.eVerified) {
      return vUser[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("utils/mongo", error.message);
  }
};

module.exports = findUserAndVerify;
