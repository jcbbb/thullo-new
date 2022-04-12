import { Session } from "../models/session.model.js";

export function createOne(trx) {
  return async ({ user_id, provider_name, user_agent }) => {
    return await Session.query(trx).insert({
      user_id,
      auth_provider_name: provider_name,
      user_agent,
    });
  };
}

export async function getOne(sid) {
  return await Session.query().findById(sid);
}

export async function deleteOne(sid) {
  return await Session.query().deleteById(sid);
}

export async function validateOne(sid) {
  if (!sid) return;
  const session = await getOne(sid);
  return session.active;
}
