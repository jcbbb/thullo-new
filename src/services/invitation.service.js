import { Invitation } from "../models/invitation.model.js";

export async function createOne({ user_id, board_id }) {
  return await Invitation.query().insert({ user_id, board_id });
}

export async function getMany({ board_id }, relations = []) {
  const str = relations.toString();
  const newRelations = str ? `[${str}]` : str;
  return await Invitation.query().where({ board_id }).withGraphFetched(newRelations);
}

export async function updateOne(id, update) {
  return await Invitation.query().patchAndFetchById(id, update);
}

export async function deleteOne(id) {
  return await Invitation.query().deleteById(id);
}
