import config from "../config/index.js";

export function generateAccessCookie(sid) {
  return {
    cookie: {
      name: config.session_cookie_name,
      value: sid,
    },
    opts: {
      secure: true,
      sameSite: true,
      httpOnly: true,
      signed: true,
      domain: config.origin,
      path: "/",
    },
  };
}

export function removeAccessCookie() {
  return {
    cookie: {
      name: config.session_cookie_name,
      value: "invalid",
    },
    opts: {
      secure: true,
      sameSite: true,
      httpOnly: true,
      signed: true,
      domain: config.origin,
      path: "/",
      expires: new Date(null),
    },
  };
}
