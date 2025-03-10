require("dotenv").config();

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");


console.log(process.env.AWS_ACCESS_KEY_ID); // Check if the AWS Access Key is printed
console.log(process.env.AWS_SECRET_ACCESS_KEY); // Check if the AWS Secret Access Key is printed
console.log(process.env.AWS_REGION); // Check if the AWS region is printed


const s3 = new S3Client({
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION 
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET,
        ACL: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
                return cb(new Error("Only image and video files are allowed"), false);
            }
           
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed"));
        }
    }
});

module.exports = upload;
