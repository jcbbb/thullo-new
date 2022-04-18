import { Credential } from "../models/credential.model.js";

export function createOne(trx) {
  return async (credential) => await Credential.query(trx).insert(credential);
}

export async function updateOne(credential_id, update) {
  return await Credential.query().findOne({ credential_id }).patch(update);
}

export async function getOne(credential_id) {
  return await Credential.query().findOne({ credential_id });
}
