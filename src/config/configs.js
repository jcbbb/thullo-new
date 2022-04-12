import {
  PORT,
  PORT_DEV,
  PORT_STAGING,
  POSTGRES_URI,
  POSTGRES_URI_DEV,
  POSTGRES_URI_STAGING,
  JWT_SECRET,
  COOKIE_SECRET,
  ORIGIN_DEV,
  ORIGIN_STAGING,
  ORIGIN,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME_DEV,
  SESSION_COOKIE_NAME_STAGING,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET_NAME,
  S3_ORIGIN,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET,
} from "./secrets.js";

export const configs = {
  production: {
    port: PORT,
    postgres_uri: POSTGRES_URI,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN,
    s3_origin: S3_ORIGIN,
    session_cookie_name: SESSION_COOKIE_NAME,
    aws_access_key: AWS_ACCESS_KEY,
    aws_secret_key: AWS_SECRET_KEY,
    aws_s3_region: AWS_S3_REGION,
    aws_s3_bucket_name: AWS_S3_BUCKET_NAME,
    github_client_secret: GITHUB_CLIENT_SECRET,
    google_client_secret: GOOGLE_CLIENT_SECRET,
  },
  development: {
    port: PORT_DEV,
    postgres_uri: POSTGRES_URI_DEV,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN_DEV,
    s3_origin: S3_ORIGIN,
    session_cookie_name: SESSION_COOKIE_NAME_DEV,
    aws_access_key: AWS_ACCESS_KEY,
    aws_secret_key: AWS_SECRET_KEY,
    aws_s3_region: AWS_S3_REGION,
    aws_s3_bucket_name: AWS_S3_BUCKET_NAME,
    github_client_secret: GITHUB_CLIENT_SECRET,
    google_client_secret: GOOGLE_CLIENT_SECRET,
  },
  staging: {
    port: PORT_STAGING,
    postgres_uri: POSTGRES_URI_STAGING,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN_STAGING,
    s3_origin: S3_ORIGIN,
    session_cookie_name: SESSION_COOKIE_NAME_STAGING,
    aws_access_key: AWS_ACCESS_KEY,
    aws_secret_key: AWS_SECRET_KEY,
    aws_s3_region: AWS_S3_REGION,
    aws_s3_bucket_name: AWS_S3_BUCKET_NAME,
    github_client_secret: GITHUB_CLIENT_SECRET,
    google_client_secret: GOOGLE_CLIENT_SECRET,
  },
};
