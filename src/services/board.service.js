import { Board } from "../models/board.model.js";
import { List } from "../models/list.model.js";
import { ListItem } from "../models/list-item.model.js";

export async function createOne(board) {
  return await Board.query().insert(board);
}

export async function getMany({ creator_id }) {
  return await Board.query().where({ creator_id }).withGraphFetched("members");
}

export async function addMember({ user_id, board_id }) {
  return await Board.relatedQuery("members").for(board_id).relate(user_id);
}

export async function addListItemMember({ user_id, list_item_id }) {
  return await ListItem.relatedQuery("members").for(list_item_id).relate(user_id);
}

export async function getOne(id) {
  return await Board.query().findById(id).withGraphFetched("[lists.[items], members, creator]");
}

export async function updateOne(id, update) {
  return await Board.query().patchAndFetchById(id, update);
}

export async function createList({ board_id, title, order }) {
  return await List.query().insert({ board_id, title, order });
}

export async function deleteList(id) {
  return await List.query().deleteById(id);
}
export async function updateList(id, update) {
  return await List.query().patchAndFetchById(id, update);
}

export async function addListItem({ title, order, list_id }) {
  return await ListItem.query().insert({ title, order, list_id });
}
