const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
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

const uploadUser = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read-write',
    key: async (req, file, cb) => {
      try {
        // 유저 아이디 추출
        const { id } = req.user;

        // 이미지가 이미 존재하는지 확인할 객체 키 생성
        const keyToCheck = `user_img/${id}`;

        // S3에서 동일한 유저 아이디를 가진 객체 찾기
        const listObjectsParams = {
          Bucket: process.env.BUCKET_NAME,
          Prefix: keyToCheck,
        };

        const data = await s3Client.send(new ListObjectsCommand(listObjectsParams)); // 변경된 부분

        const { Contents } = data || {}; // Contents를 별도로 추출

        // 동일한 유저 아이디를 가진 객체가 존재하면 삭제
        if (Contents && Contents.length > 0) {
          Contents.forEach(async (object) => {
            const deleteParams = {
              Bucket: process.env.BUCKET_NAME,
              Key: object.Key,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
          });
        }

        // 현재 시간 및 파일 확장자 추출
        const now = Date.now();
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const extension = path.extname(file.originalname);

        // 새로운 이미지 업로드
        const key = `user_img/${id}_${now}_${file.originalname}`;
        cb(null, key);
      } catch (error) {
        console.error('Error:', error);
        cb(error);
      }
    },
  }),
});

module.exports = { upload, uploadUser };
