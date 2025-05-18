require('dotenv').config();


module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  s3Bucket: process.env.AWS_S3_BUCKET,
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKeyID: process.env.AWS_SECRET_ACCESS_KEY
};
