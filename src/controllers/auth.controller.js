import * as AuthService from "../services/auth.service.js";
import * as CookieService from "../services/cookie.service.js";
import config from "../config/index.js";

export async function getSignup(req, res) {
  const cookie = req.cookies[config.session_cookie_name];
  const sid = cookie && req.unsignCookie(cookie);
  if (!sid || !sid.valid) return res.render("auth/signup", { title: "Signup" });
  const session = await AuthService.getSession(sid.value);
  if (!session) {
    const { cookie, opts } = CookieService.removeAccessCookie();
    res.setCookie(cookie.name, cookie.value, opts);
    return res.render("auth/signup", { title: "Signup" });
  }
  if (session.active) return res.redirect("/");
  res.render("auth/signup", { title: "Signup" });
}

export async function getLogin(req, res) {
  const cookie = req.cookies[config.session_cookie_name];
  const sid = cookie && req.unsignCookie(cookie);
  if (!sid || !sid.valid) return res.render("auth/login", { title: "Login" });
  const session = await AuthService.getSession(sid.value);
  if (!session) {
    const { cookie, opts } = CookieService.removeAccessCookie();
    res.setCookie(cookie.name, cookie.value, opts);
    return res.render("auth/login", { title: "Signup" });
  }
  if (session.active) return res.redirect("/");
  res.render("auth/login", { title: "Login" });
}

export async function signup(req, res) {
  const { email, password, name } = req.body;
  const { session } = await AuthService.signup({ email, password, name });
  const { cookie, opts } = CookieService.generateAccessCookie(session.id);
  res.setCookie(cookie.name, cookie.value, opts);
  res.redirect("/");
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { session } = await AuthService.login({ email, password });
  const { cookie, opts } = CookieService.generateAccessCookie(session.id);
  res.setCookie(cookie.name, cookie.value, opts);
  res.redirect("/");
}
