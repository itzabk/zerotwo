function genericTemplate(SchemaName) {
  return function Validate(req, res, next) {
    try {
      const { error, value } = SchemaName.validate(req.body);
      if (!error) {
        if (process.env.NODE_ENV === "dev") {
          console.log(value);
        }
        next();
      }
      if (error) {
        const result = error.details.map((ele) => ele.message).join(",");
        return res.status(400).json({ message: result });
      }
    } catch (err) {
      console.log("middlewares/JOI/genericValidationTemplate", err?.message);
    }
  };
}

module.exports = genericTemplate;
