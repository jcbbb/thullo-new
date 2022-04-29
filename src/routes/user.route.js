import * as UserController from "../controllers/user.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const user = async (fastify) => {
  fastify.register(authenticate);
  fastify.get("/", UserController.getMany);
};
