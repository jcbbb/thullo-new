import { User } from "../models/user.model.js";
import * as SessionService from "../services/session.service.js";
import * as UserService from "../services/user.service.js";
import { ResourceNotFoundError, BadRequestError } from "../utils/errors.js";

export async function signup({ password, name, email, provider_name, user_agent }) {
  const trx = await User.startTransaction();
  try {
    const user = await UserService.createOne(trx)({
      password,
      email,
      name,
    });
    const session = await SessionService.createOne(trx)({
      user_id: user.id,
      provider_name,
      user_agent,
    });
    await trx.commit();
    return { session, user };
  } catch (err) {
    trx.rollback();
    throw err;
  }
}

export async function login({ email, password, provider_name, user_agent }) {
  const user = await UserService.getByEmail(email);

  if (!user) throw new ResourceNotFoundError(`User with email ${email} not found`, "auth/login");

  const isValid = await user.verifyPassword(password);

  if (!isValid)
    throw new BadRequestError(
      "Invalid email or password. Maybe you logged in with social media?",
      "auth/login"
    );

  const session = await SessionService.createOne()({
    user_id: user.id,
    auth_provider_name: provider_name,
    user_agent,
  });

  return { user, session };
}
