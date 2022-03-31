import * as HomeController from "../controllers/home.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const home = async (fastify) => {
  fastify.register(authenticate);
  fastify.get("/", HomeController.getIndex);
};
