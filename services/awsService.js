const AWS = require("aws-sdk");
const { s3Bucket, awsRegion } = require("../config");

AWS.config.update({ region: awsRegion });

const s3 = new AWS.S3();
const textract = new AWS.Textract();

/**
 * Uploads file to S3
 */
exports.uploadToS3 = async (buffer, fileName, mimeType) => {
  const params = {
    Bucket: s3Bucket,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  };
  await s3.putObject(params).promise();
  return `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${fileName}`;
};

/**
 * Extracts text from PDF in S3 using AWS Textract
 */
exports.extractTextFromS3PDF = async (fileName) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: s3Bucket,
        Name: fileName,
      },
    },
    FeatureTypes: ["TABLES", "FORMS"],
  };
  const data = await textract.analyzeDocument(params).promise();
  const blocks = data.Blocks || [];
  const lines = blocks
    .filter((b) => b.BlockType === "LINE")
    .map((l) => l.Text)
    .join(" ");
  return lines;
};
