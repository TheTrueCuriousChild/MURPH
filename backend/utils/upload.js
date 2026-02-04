import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const S3 = new S3Client({
  region: "us-east-005",
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_KEY,
  },
  forcePathStyle: true, 
});


const uploadFile = async (filePath, key = uuid()) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: key,
        Body: fileStream
      })
    );

    console.log(`Uploaded ${filePath} as ${key}`);
    return key;
  } catch (err) {
    console.error("Upload Error:", err);
    throw err;
  }
};

export default uploadFile;
