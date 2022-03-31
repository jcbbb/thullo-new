import * as BoardController from "../controllers/board.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const board = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", BoardController.createOne);
  fastify.get("/new", BoardController.getNew);
  fastify.post("/:id/members", BoardController.addMember);
};
