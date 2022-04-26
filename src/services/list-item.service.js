import { ListItem } from "../models/list-item.model.js";

export async function createOne({ title, pos, list_id, board_id }) {
  return await ListItem.query().insert({ title, pos, list_id, board_id });
}

export async function addMember({ user_id, list_item_id }) {
  return await ListItem.relatedQuery("members").for(list_item_id).relate(user_id);
}

export async function getOne(id) {
  return await ListItem.query().findById(id).withGraphFetched("[attachments, comments.[user]]");
}

export async function updateOne(id, update) {
  return await ListItem.query().patchAndFetchById(id, update);
}

export async function deleteOne(id) {
  return await ListItem.query().deleteById(id);
}
