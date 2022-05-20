import fp from "fastify-plugin";
import { AuthorizationError } from "../utils/errors.js";

async function asyncSome(arr, ...params) {
  for (const item of arr) {
    if (await item(...params)) return true;
    return false;
  }
}

export const can = (...validationsFns) => {
  return fp(async function can(fastify, opts) {
    fastify.addHook("preHandler", async (req, res) => {
      const user = req.user;
      const canAccess = await asyncSome(validationsFns, user, req.params);
      if (!canAccess) {
        const error = new AuthorizationError(
          `User ${user.name} does not have permissions to modify or access this resource`
        );
        return res.code(error.status_code).send(error);
      }
    });
  });
};
