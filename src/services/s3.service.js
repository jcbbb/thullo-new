import config from "../config/index.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: config.aws_s3_region,
  credentials: {
    accessKeyId: config.aws_access_key,
    secretAccessKey: config.aws_secret_key,
  },
});

const getKey = (filename) => `${randomUUID()}-${filename}`;
const getUrl = (key) =>
  `https://s3.${config.aws_s3_region}.amazonaws.com/${config.aws_s3_bucket_name}/${key}`;

export async function upload(file) {
  const key = getKey(file.filename);
  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws_s3_bucket_name,
      Key: key,
      Body: await file.toBuffer(),
      ContentType: file.mimetype,
    })
  );
  return getUrl(key);
}