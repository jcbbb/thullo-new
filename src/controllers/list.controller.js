import * as ListService from "../services/list.service.js";

export async function getOne(req, res) {}

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const { title, pos } = req.body;
  await ListService.createOne({ title, board_id, pos });
  res.redirect(`/boards/${board_id}`);
}

export async function updateOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id;
  const { _action, title, pos } = req.body;

  const accept = req.accepts();

  switch (accept.type(["json", "html"])) {
    case "html": {
      switch (_action) {
        case "delete":
          await ListService.deleteOne(list_id);
          return res.redirect(`/boards/${board_id}`);
        default:
          await ListService.updateOne({ update: { title, pos }, id: list_id, board_id });
          return res.redirect(`/boards/${board_id}`);
      }
    }

    case "json": {
      switch (_action) {
        case "delete":
          await ListService.deleteOne(list_id);
          return res.send({ list_id });
        default:
          await ListService.updateOne({ update: { title, pos }, id: list_id, board_id });
          return res.send();
      }
    }
  }
  res.send();
}

export async function deleteOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id;
  await ListService.deleteOne(list_id);
  res.redirect(`/boards/${board_id}`);
}
