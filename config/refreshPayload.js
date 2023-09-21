//Refresh Payload
const generateRefreshPayload = (foundUser) => {
  try {
    const refreshPayload = {
      userInfo: {
        name: foundUser.name,
        email: foundUser.email,
      },
    };
    return refreshPayload;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = generateRefreshPayload;
