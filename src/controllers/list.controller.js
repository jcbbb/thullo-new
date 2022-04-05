import * as ListService from "../services/list.service.js";

export async function getOne(req, res) {}

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const { title, order } = req.body;
  await ListService.createOne({ title, board_id, order });
  res.redirect(`/boards/${board_id}`);
}

export async function updateOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id;
  const { _action, title, order } = req.body;

  switch (_action) {
    case "delete":
      await ListService.deleteOne(list_id);
      break;
    default:
      await ListService.updateOne(list_id, { title, order });
  }

  res.redirect(`/boards/${board_id}`);
}

export async function deleteOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id;
  await ListService.deleteOne(list_id);
  res.redirect(`/boards/${board_id}`);
}
