import * as CommentService from "../services/comment.service.js";

export async function createOne(req, res) {
  const user = req.user;
  const { content, board_id, list_item_id } = req.body;
  await CommentService.createOne({ content, board_id, list_item_id, user_id: user.id });
  res.redirect(`/list-items/${list_item_id}`);
}

export async function updateOne(req, res) {
  const { comment_id } = req.params;
  const { _action, content, list_item_id } = req.body;

  switch (_action) {
    case "delete": {
      await CommentService.deleteOne(comment_id);
      break;
    }
    default:
      await CommentService.updateOne(comment_id, { content });
  }

  res.redirect(`/list-items/${list_item_id}`);
}

export async function deleteOne(req, res) {}
