import config from "../config/index.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { asyncPool } from "../utils/index.js";

const s3 = new S3Client({
  region: config.aws_s3_region,
  credentials: {
    accessKeyId: config.aws_access_key,
    secretAccessKey: config.aws_secret_key,
  },
});

const getKey = (filename) => `${randomUUID()}-${filename}`;
const getS3Url = (key) =>
  `https://s3.${config.aws_s3_region}.amazonaws.com/${config.aws_s3_bucket_name}/${key}`;
const getUrl = (key) => `https://${config.s3_origin}/${key}`;

export async function upload(file) {
  const key = getKey(file.filename);
  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws_s3_bucket_name,
      Key: key,
      Body: await file.toBuffer(),
      ContentType: file.mimetype,
      CacheControl: "max-age=31536000",
    })
  );
  return {
    s3_url: getS3Url(key),
    url: getUrl(key),
    s3_key: key,
    name: file.filename,
    mimetype: file.mimetype,
  };
}

export async function* uploadMultiple(files) {
  for await (const attachment of asyncPool(5, [files].flat(), upload)) {
    yield attachment;
  }
}

export async function deleteOne(key) {
  return await s3.send(new DeleteObjectCommand({ Key: key, Bucket: config.aws_s3_bucket_name }));
}
