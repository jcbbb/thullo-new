import * as AttachmentController from "../controllers/attachment.controller.js";

export const attachment = async (fastify) => {
  fastify.post("/", AttachmentController.upload);
  fastify.delete("/:attachment_id", AttachmentController.deleteOne);
  fastify.post("/:attachment_id", AttachmentController.deleteOne);
};
