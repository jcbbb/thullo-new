import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";

export async function signup({ password, name, email }) {
  const trx = await User.startTransaction();
  try {
    const user = await User.query(trx).insert({
      password,
      email,
      name,
    });
    const session = await Session.query(trx).insert({ user_id: user.id });
    await trx.commit();
    return { session, user };
  } catch (err) {
    trx.rollback();
    throw err;
  }
}

export async function login({ email, password }) {
  const user = await User.query().findOne({ email });
  if (!user) throw new Error("User not found");
  const isValid = await user.verifyPassword(password);
  if (!isValid) throw new Error("Invalid password");
  const session = await Session.query().insert({ user_id: user.id });
  return { user, session };
}

export async function getSession(sid) {
  return await Session.query().findById(sid);
}
