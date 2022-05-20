import * as BoardController from "../controllers/board.controller.js";
import * as ListController from "../controllers/list.controller.js";
import * as InvitationController from "../controllers/invitation.controller.js";
import { authenticate } from "../plugins/authenticate.js";

export const board = async (fastify) => {
  fastify.register(authenticate);
  fastify.post("/", BoardController.createOne);
  fastify.get("/new", BoardController.getNew);
  fastify.get("/:board_id", BoardController.getOne);
  fastify.post("/:board_id", BoardController.updateOne);
  fastify.patch("/:board_id", BoardController.updateOne);
  fastify.post("/:board_id/members", BoardController.addMember);
  fastify.get("/:board_id/members", BoardController.getMembers);
  fastify.post("/:board_id/lists", ListController.createOne);
  fastify.get("/:board_id/invitations/new", InvitationController.getNew);
  fastify.post("/:board_id/invitations", InvitationController.create);
  fastify.get("/:board_id/invitations", InvitationController.getBoardInvitations);
};
