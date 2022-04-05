import * as AuthService from "../services/auth.service.js";
import * as CookieService from "../services/cookie.service.js";
import config from "../config/index.js";

export async function getSignup(req, res) {
  const { return_to = "/" } = req.query;
  const cookie = req.cookies[config.session_cookie_name];
  const sid = cookie && req.unsignCookie(cookie);
  if (!sid || !sid.valid) return res.render("auth/signup", { return_to });
  const session = await AuthService.getSession(sid.value);
  if (!session) {
    const { cookie, opts } = CookieService.removeAccessCookie();
    res.setCookie(cookie.name, cookie.value, opts);
    return res.render("auth/signup", { return_to });
  }
  if (session.active) return res.redirect("/");
  res.render("auth/signup", { return_to });
}

export async function getLogin(req, res) {
  const { return_to = "/" } = req.query;
  const cookie = req.cookies[config.session_cookie_name];
  const sid = cookie && req.unsignCookie(cookie);
  if (!sid || !sid.valid) return res.render("auth/login", { return_to });
  const session = await AuthService.getSession(sid.value);
  if (!session) {
    const { cookie, opts } = CookieService.removeAccessCookie();
    res.setCookie(cookie.name, cookie.value, opts);
    return res.render("auth/login", { return_to });
  }
  if (session.active) return res.redirect("/");
  res.render("auth/login", { return_to });
}

export async function signup(req, res) {
  const { return_to = "/" } = req.query;
  const { email, password, name } = req.body;
  const { session } = await AuthService.signup({ email, password, name });
  const { cookie, opts } = CookieService.generateAccessCookie(session.id);
  res.setCookie(cookie.name, cookie.value, opts);
  res.redirect(return_to);
}

export async function login(req, res) {
  const { return_to = "/" } = req.query;
  const { email, password } = req.body;
  const { session } = await AuthService.login({ email, password });
  const { cookie, opts } = CookieService.generateAccessCookie(session.id);
  res.setCookie(cookie.name, cookie.value, opts);
  res.redirect(return_to);
}

export async function logout(req, res) {
  const ck = req.cookies[config.session_cookie_name];
  const sid = ck && req.unsignCookie(ck);
  if (!sid || !sid.valid) return res.render("auth/login");
  await AuthService.deleteSession(sid.value);
  const { cookie, opts } = CookieService.removeAccessCookie();
  res.setCookie(cookie.name, cookie.value, opts);
  res.redirect("/");
}
