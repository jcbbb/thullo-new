import * as ListItemController from "../controllers/list-item.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const listItem = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", ListItemController.createOne);
  fastify.post("/:list_item_id/members", ListItemController.addMember);
};
