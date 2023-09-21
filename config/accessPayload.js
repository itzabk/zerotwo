//Access Payload
const generateAccessPayload = (foundUser) => {
  try {
    const accessPayload = {
      userInfo: {
        _id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role,
      },
    };
    return accessPayload;
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = generateAccessPayload;
