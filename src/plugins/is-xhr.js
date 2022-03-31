import fp from "fastify-plugin";

export const isXhr = fp(function isXhr(fastify, opts, next) {
  fastify.decorateRequest("xhr", false);

  fastify.addHook("preHandler", (req, res, next) => {
    req.xhr = req.headers["x-requested-with"] === "XMLHttpRequest";
    next();
  });

  next();
});
