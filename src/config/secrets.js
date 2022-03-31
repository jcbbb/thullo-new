import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT, 10);
const PORT_DEV = parseInt(process.env.PORT_DEV, 10);
const PORT_STAGING = parseInt(process.env.PORT_STAGING, 10);

export { PORT, PORT_DEV, PORT_STAGING };
export const {
  NODE_ENV,
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
} = process.env;
