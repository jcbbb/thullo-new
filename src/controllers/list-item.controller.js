import * as ListItemService from "../services/list-item.service.js";
import * as ListService from "../services/list.service.js";
import * as S3Service from "../services/s3.service.js";
import * as BoardService from "../services/board.service.js";
import * as AttachmentService from "../services/attachment.service.js";
import { normalizeBody, formatter } from "../utils/index.js";

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const list_id = req.params.list_id || req.body.list_id;
  const { title, pos } = req.body;
  await ListItemService.createOne({ title, pos, list_id, board_id });
  res.redirect(`/boards/${board_id}`);
}

export async function addMember(req, res) {
  const { list_item_id } = req.params;
  const { user_id, board_id } = req.body;
  await ListItemService.addMember({ user_id, list_item_id });
  res.redirect(`/boards/${board_id}`);
}

export async function getOne(req, res) {
  const user = req.user;
  const { list_item_id } = req.params;
  const item = await ListItemService.getOne(list_item_id);
  const list = await ListService.getOne(item.list_id);
  const board = await BoardService.getOne(item.board_id);
  res.render(
    "list/list-item",
    {
      method: "post",
      title: `Edit item ${item.title}`,
      user,
      board,
      item: Object.assign(item, { list }),
      formatter,
    },
    { layout: "layout.html" }
  );
}

export async function updateOne(req, res) {
  const { list_item_id } = req.params;
  const { _action, description, attachments, board_id, attachment_id, s3_key } = normalizeBody(
    req.body
  );

  switch (_action) {
    case "delete":
      await ListItemService.deleteOne(list_item_id);
      break;
    case "attach": {
      for await (const attachment of S3Service.uploadMultiple(attachments)) {
        await AttachmentService.createOne({ attachment, board_id, list_item_id });
      }
      break;
    }

    case "delete_attachment": {
      if (s3_key) {
        await S3Service.deleteOne(s3_key);
        await AttachmentService.deleteOne(attachment_id);
      } else {
        const attachment = await AttachmentService.getOne(attachment_id);
        await S3Service.deleteOne(attachment.s3_key);
        await AttachmentService.deleteOne(attachment_id);
      }
      break;
    }
    default:
      await ListItemService.updateOne(list_item_id, { description });
  }

  res.redirect(`/list-items/${list_item_id}`);
}

export async function deleteOne(req, res) {
  const { list_item_id } = req.params;
  res.redirect("/");
}
