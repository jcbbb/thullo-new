import * as ListItemService from "../services/list-item.service.js";

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id || req.body.list_id;
  const { title, order } = req.body;
  await ListItemService.createOne({ title, order, list_id });
  res.redirect(`/boards/${board_id}`);
}

export async function addMember(req, res) {
  const { list_item_id } = req.params;
  const { user_id, board_id } = req.body;
  await ListItemService.addMember({ user_id, list_item_id });
  res.redirect(`/boards/${board_id}`);
}
