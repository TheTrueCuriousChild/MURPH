import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

    console.log(`[S3] Uploading to Bucket: ${process.env.B2_BUCKET_NAME}, Key: ${key}`);
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: key,
        Body: fileStream
      })
    );

    console.log(`[S3] Successfully uploaded ${filePath} as ${key}`);
    return key;
  } catch (err) {
    console.error("[S3] Upload Error:", err);
    throw err;
  }
};

/**
 * Generate a signed URL for a video file in B2/S3
 * @param {string} key - The object key (videoUrl in Lecture model)
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string>}
 */
export const getSignedVideoUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(S3, command, { expiresIn });
    return url;
  } catch (err) {
    console.error("Signed URL Error:", err);
    throw err;
  }
};

/**
 * Get a readable stream for a video file in B2/S3
 * @param {string} key - The object key
 * @returns {Promise<{stream: NodeJS.ReadableStream, contentType: string, contentLength: number}>}
 */
export const getVideoStream = async (key) => {
  try {
    console.log(`[S3] Fetching stream from Bucket: ${process.env.B2_BUCKET_NAME}, Key: ${key}`);
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    });

    const response = await S3.send(command);
    console.log(`[S3] Successfully started stream for Key: ${key}`);
    return {
      stream: response.Body,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
    };
  } catch (err) {
    console.error(`[S3] Get Video Stream Error for Key: ${key}:`, err);
    throw err;
  }
};

export default uploadFile;
