import * as UserController from "../controllers/user.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const board = async (fastify) => {
  fastify.register(authenticate);
  fastify.get("/users", UserController.getMany);
};
