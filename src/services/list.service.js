import { List } from "../models/list.model.js";

export async function createOne({ board_id, title, order }) {
  return await List.query().insert({ board_id, title, order });
}

export async function deleteOne(id) {
  return await List.query().deleteById(id);
}

export async function updateOne(id, update) {
  return await List.query().patchAndFetchById(id, update);
}
