import * as MailController from "../controllers/mail.controller.js";

export const auth = async (fastify) => {
  fastify.post("/email", MailController.email);
};
