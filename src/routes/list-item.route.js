import * as ListItemController from "../controllers/list-item.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const listItem = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", ListItemController.createOne);
  fastify.post("/:list_item_id/members", ListItemController.addMember);
  fastify.post("/:list_item_id/labels", ListItemController.addLabel);
  fastify.get("/:list_item_id", ListItemController.getOne);
  fastify.post("/:list_item_id", ListItemController.updateOne);
  fastify.patch("/:list_item_id", ListItemController.updateOne);
  fastify.delete("/:list_item_id", ListItemController.deleteOne);
};
