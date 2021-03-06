import * as AuthController from "../controllers/auth.controller.js";

export const auth = async (fastify) => {
  fastify.get("/login", AuthController.getLogin);
  fastify.get("/signup", AuthController.getSignup);
  fastify.post("/signup", AuthController.signup);
  fastify.post("/login", AuthController.login);
  fastify.post("/logout", AuthController.logout);
  fastify.get("/github", AuthController.githubCallback);
  fastify.get("/google", AuthController.googleCallback);
  fastify.post("/requests", AuthController.createRequest);
  fastify.post("/credentials", AuthController.createCredential);
  fastify.post("/assertions", AuthController.assertCredential);
  fastify.head("/credentials/:email", AuthController.checkExisting);
};
