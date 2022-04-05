import * as ListController from "../controllers/list.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const list = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", ListController.createOne);
  fastify.post("/:list_id", ListController.updateOne);
  fastify.patch("/:list_id", ListController.updateOne);
  fastify.delete("/:list_id", ListController.deleteOne);
};
