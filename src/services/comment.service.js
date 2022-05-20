import { Comment } from "../models/index.js";

export async function createOne({ content, board_id, list_item_id, user_id }) {
  return await Comment.query()
    .insert({ content, board_id, list_item_id, user_id })
    .withGraphFetched("user");
}

export async function deleteOne(id) {
  return await Comment.query().deleteById(id);
}

export async function updateOne(id, update) {
  return await Comment.query().patchAndFetchById(id, update);
}

export async function getOne(id) {
  return await Comment.query().findById(id).withGraphFetched("user");
}
