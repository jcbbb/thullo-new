import { ListItem } from "../models/list-item.model.js";

export async function createOne({ title, order, list_id }) {
  return await ListItem.query().insert({ title, order, list_id });
}

export async function addMember({ user_id, list_item_id }) {
  return await ListItem.relatedQuery("members").for(list_item_id).relate(user_id);
}
