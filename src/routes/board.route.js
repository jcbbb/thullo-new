import * as BoardController from "../controllers/board.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const board = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", BoardController.createOne);
  fastify.get("/new", BoardController.getNew);
  fastify.get("/:id", BoardController.getOne);
  fastify.post("/:id", BoardController.updateOne);
  fastify.patch("/:id", BoardController.updateOne);
  fastify.post("/:id/members", BoardController.addMember);
  fastify.post("/:id/lists", BoardController.createList);
  fastify.post("/:id/lists/:list_id", BoardController.addListItem);
};
