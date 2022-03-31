import { home } from "./home.route.js";
import { auth } from "./auth.route.js";
import { board } from "./board.route.js";

export const routes = async (fastify) => {
  fastify.register(home);
  fastify.register(auth, { prefix: "/auth" });
  fastify.register(board, { prefix: "/boards" });
};
