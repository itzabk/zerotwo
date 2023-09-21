const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const customError = require("../utils/customError");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new customError("Not an image! Please upload images only.", 400), false);
  }
};
const upload = multer({
  fileFilter: multerFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    limits: {
      fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.fieldname + "_" + file.originalname);
    },
  }),
});

module.exports = upload;
