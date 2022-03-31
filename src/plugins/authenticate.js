import fp from "fastify-plugin";
import * as AuthService from "../services/auth.service.js";
import * as UserService from "../services/user.service.js";
import * as CookieService from "../services/cookie.service.js";
import config from "../config/index.js";

export const authenticate = fp(async function authenticate(fastify, opts) {
  fastify.decorateRequest("user", null);

  fastify.addHook("preHandler", async (req, res) => {
    const cookie = req.cookies[config.session_cookie_name];
    const sid = cookie && req.unsignCookie(cookie);
    if (!sid || !sid.valid) return res.render("auth/signup", { title: "Signup" });
    const session = await AuthService.getSession(sid.value);

    if (!session) {
      const { cookie, opts } = CookieService.removeAccessCookie();
      res.setCookie(cookie.name, cookie.value, opts);
      return res.render("auth/signup", { title: "Signup" });
    }

    if (!session.active) return res.render("auth/signup", { title: "Signup" });
    const user = await UserService.getOne(session.user_id);

    req.user = user;
  });
});
