import * as InvitationController from "../controllers/invitation.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const invitation = async (fastify) => {
  fastify.register(authenticate);
  fastify.get("/:id", InvitationController.getOne);
  fastify.post("/", InvitationController.createOne);
};
