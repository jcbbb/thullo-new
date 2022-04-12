import { home } from "./home.route.js";
import { auth } from "./auth.route.js";
import { board } from "./board.route.js";
import { invitation } from "./invitation.route.js";
import { list } from "./list.route.js";
import { listItem } from "./list-item.route.js";
import { comment } from "./comment.route.js";

export const routes = async (fastify) => {
  fastify.register(home);
  fastify.register(auth, { prefix: "/auth" });
  fastify.register(board, { prefix: "/boards" });
  fastify.register(invitation, { prefix: "/invitations" });
  fastify.register(list, { prefix: "/lists" });
  fastify.register(listItem, { prefix: "/list-items" });
  fastify.register(comment, { prefix: "/comments" });
};
