const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();
const path = require('path');

const s3 = new AWS.S3({
  region: process.env.S3_BUCKET_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read-write',
    key: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return cb(new Error('wrong extension'));
      }
      cb(null, `menuimage/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
