import * as InvitationController from "../controllers/invitation.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const invitation = async (fastify) => {
  fastify.register(authenticate);
  fastify.get("/:invite_id", InvitationController.getOne);
  fastify.get("/", InvitationController.getMany);
  fastify.post("/", InvitationController.createOne);
  fastify.post("/:invite_id", InvitationController.updateOne);
  fastify.patch("/:invite_id", InvitationController.updateOne);
  fastify.delete("/:invite_id", InvitationController.deleteOne);
};