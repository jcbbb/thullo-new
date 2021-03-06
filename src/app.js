import fastify from "fastify";
import fastifyStatic from "fastify-static";
import fastifySession from "fastify-secure-session";
import fastifyFlash from "fastify-flash";
import fastifyEtag from "fastify-etag";
import view from "point-of-view";
import path from "path";
import config from "./config/index.js";
import formBody from "fastify-formbody";
import multipart from "fastify-multipart";
import fastifyAccepts from "fastify-accepts";
import os from "os";
import * as eta from "eta";
import { routes } from "./routes/index.js";
import { isXhr } from "./plugins/is-xhr.js";
import { DomainError, InternalError } from "./utils/errors.js";

process.env.UV_THREADPOOL_SIZE = os.cpus().length;

export async function start() {
  const app = fastify({
    logger: true,
    ignoreTrailingSlash: true,
  });
  try {
    app.register(isXhr);
    app.register(formBody);
    app.register(multipart, { attachFieldsToBody: true });

    app.register(fastifySession, {
      secret: config.cookie_secret,
      cookieName: config.session_cookie_name,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        n: config.domain,
        path: "/",
        maxAge: 31556926,
      },
    });

    app.register(fastifyFlash);

    app.register(view, {
      engine: {
        eta,
      },
      root: path.join(process.cwd(), "src/views"),
      viewExt: "html",
      propertyName: "render",
    });

    app.register(fastifyStatic, {
      root: path.join(process.cwd(), "src/public"),
      prefix: "/public",
      decorateReply: false,
    });

    app.register(fastifyStatic, {
      root: path.join(process.cwd(), "node_modules"),
      prefix: "/node_modules",
      decorateReply: false,
    });

    app.setErrorHandler((err, req, res) => {
      if (err instanceof DomainError) {
        return res.code(err.status_code).send(err);
      }
      const internal = new InternalError();
      res.code(internal.status_code).send(internal);
    });

    app.setNotFoundHandler((req, res) => {
      res.code(404).render("404.html");
    });

    app.register(fastifyAccepts);
    app.register(fastifyEtag);
    app.register(routes);

    await app.listen(config.port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
