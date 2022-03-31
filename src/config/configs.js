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
} from "./secrets.js";

export const configs = {
  production: {
    port: PORT,
    postgres_uri: POSTGRES_URI,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN,
    session_cookie_name: SESSION_COOKIE_NAME,
  },
  development: {
    port: PORT_DEV,
    postgres_uri: POSTGRES_URI_DEV,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN_DEV,
    session_cookie_name: SESSION_COOKIE_NAME_DEV,
  },
  staging: {
    port: PORT_STAGING,
    postgres_uri: POSTGRES_URI_STAGING,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    origin: ORIGIN_STAGING,
    session_cookie_name: SESSION_COOKIE_NAME_STAGING,
  },
};
