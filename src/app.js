import fastify from "fastify";
import fastifyStatic from "fastify-static";
import view from "point-of-view";
import path from "path";
import config from "./config/index.js";
import formBody from "fastify-formbody";
import multipart from "fastify-multipart";
import cookie from "fastify-cookie";
import { routes } from "./routes/index.js";
import { isXhr } from "./plugins/is-xhr.js";
import * as eta from "eta";

export async function start() {
  const app = fastify({ logger: true });
  try {
    app.register(isXhr);
    app.register(formBody);
    app.register(multipart, { attachFieldsToBody: true });
    app.register(cookie, {
      secret: config.cookie_secret,
    });

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

    app.register(routes);

    await app.listen(config.port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
