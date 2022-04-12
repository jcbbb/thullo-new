import config from "../config/index.js";

export function generateAccessCookie(sid) {
  const now = new Date();
  const expires = now.setFullYear(now.getFullYear() + 1); // expires after 1 year

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
      expires,
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
