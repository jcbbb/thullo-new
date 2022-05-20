import * as CommentController from "../controllers/comment.controller.js";
import { authenticate } from "../plugins/authenticate.js";
import { can } from "../plugins/can.js";
import { commentOwner } from "../utils/roles.js";

export const comment = async (fastify) => {
  fastify.register(authenticate);
  fastify.register(can(commentOwner));
  fastify.post("/", CommentController.createOne);
  fastify.post("/:comment_id", CommentController.updateOne);
  fastify.patch("/:comment_id", CommentController.updateOne);
  fastify.delete("/:comment_id", CommentController.deleteOne);
};
