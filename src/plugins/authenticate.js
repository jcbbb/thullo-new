import fp from "fastify-plugin";
import * as UserService from "../services/user.service.js";
import * as SessionService from "../services/session.service.js";

export const authenticate = fp(async function authenticate(fastify, opts) {
  fastify.decorateRequest("user", null);

  fastify.addHook("preHandler", async (req, res) => {
    const sid = req.session.get("sid");
    if (!sid) return res.redirect(`/auth/login?return_to=${req.url}`);
    const session = await SessionService.getOne(sid);
    if (!session || !session.active) return res.redirect(`/auth/login?return_to=${req.url}`);
    const user = await UserService.getOne(session.user_id);

    req.user = user;
  });
});
