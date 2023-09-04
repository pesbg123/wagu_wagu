const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();
const path = require('path');

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read-write',
    key: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return cb(new Error('wrong extension'));
      }
      cb(null, `food_img/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
