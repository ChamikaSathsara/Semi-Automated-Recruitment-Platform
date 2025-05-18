const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { TextractClient, AnalyzeDocumentCommand } = require('@aws-sdk/client-textract');
const { s3Bucket, awsRegion } = require("../config"); // Ensure these are correctly set

// Initialize S3 Client with correct region and credentials
const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Ensure your AWS keys are set in environment variables or config
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize Textract Client with correct region and credentials
const textract = new TextractClient({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload file to S3
exports.uploadToS3 = async (buffer, fileName, mimeType) => {
  console.log("Starting file upload to S3...");

  // Step 1: Set the upload parameters
  const params = {
    Bucket: s3Bucket,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  };

  console.log("Upload parameters set:", params);

  try {
    // Step 2: Perform the S3 upload
    console.log("Attempting to upload file to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);

    console.log("File successfully uploaded to S3!");

    // Step 3: Construct the S3 file URL
    const fileUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${fileName}`;
    console.log("File URL constructed:", fileUrl);

    // Step 4: Return the file URL
    return fileUrl;
  } catch (error) {
    console.error("Error occurred during file upload:", error.message);

    // Log the error, but don't throw an error that would crash the app
    return {
      success: false,
      message: `Failed to upload file to S3: ${error.message}`,
    };
  }
};

// Function to get a downloadable link for the file in S3
exports.getDownloadableLink = async (fileName) => {
  console.log("Generating downloadable link for file:", fileName);

  const params = {
    Bucket: s3Bucket,
    Key: fileName,
    Expires: 3600, // URL expires after 1 hour (3600 seconds)
  };

  try {
    // Create a signed URL for the file
    const command = new GetObjectCommand(params);
    const url = await s3.getSignedUrl(command);

    console.log("Downloadable link generated:", url);

    // Return the signed URL (downloadable link)
    return url;
  } catch (error) {
    console.error("Error generating downloadable link:", error.message);
    return {
      success: false,
      message: `Failed to generate downloadable link: ${error.message}`,
    };
  }
};

// Function to extract text from PDF stored in S3 using AWS Textract
exports.extractTextFromS3PDF = async (fileName) => {
  // Log the start of the extraction process
  console.log(`Starting text extraction from PDF: ${fileName}`);

  // Get the downloadable link for the file
  const downloadLink = await exports.getDownloadableLink(fileName);
  if (!downloadLink.success) {
    console.log('Failed to get the downloadable link.');
    return '';
  }

  const params = {
    Document: {
      S3Object: {
        Bucket: s3Bucket,
        Name: fileName,
      },
    },
    FeatureTypes: ["TABLES", "FORMS"],
  };

  console.log('Parameters for Textract API:', params);

  try {
    // Log before making the API call
    console.log('Sending request to AWS Textract...');

    const command = new AnalyzeDocumentCommand(params);
    const data = await textract.send(command);

    // Log successful API response
    console.log('Textract API response received:', data);

    // Extracting the text from the response blocks
    const blocks = data.Blocks || [];
    console.log(`Total blocks received: ${blocks.length}`);

    // Filter and map only the lines of text from the response
    const lines = blocks
      .filter((b) => b.BlockType === "LINE")
      .map((l) => l.Text)
      .join(" ");

    // Log the extracted text (first 200 characters to avoid too much logging)
    console.log('Extracted text (first 200 chars):', lines.slice(0, 200));

    // Return the extracted lines
    return lines;
  } catch (error) {
    // Log any errors that occur during the extraction process
    console.error("Error extracting text from PDF:", error.message);
    return '';
  }
};
