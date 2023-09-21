const authorizeRole = (validRole) => {
  return (req, res, next) => {
    const validity = validRole.some((ele) => req.role.includes(ele));
    if (!validity) {
      return res
        .status(401)
        .json({ message: "Unauthorized access! you will be reported" });
    }
    if (validity) {
      next();
      console.log("Authorization Successful");
    }
  };
};

module.exports = authorizeRole;
