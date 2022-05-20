import * as CommentService from "../services/comment.service.js";
import { formatter } from "../utils/index.js";

export async function createOne(req, res) {
  const user = req.user;
  const { content, board_id, list_item_id } = req.body;

  const comment = await CommentService.createOne({
    content,
    board_id,
    list_item_id,
    user_id: user.id,
  });

  const accept = req.accepts();

  switch (accept.type(["json", "html"])) {
    case "html": {
      if (req.xhr) {
        return res.render("partials/comment.html", { comment, formatter });
      }
      res.redirect(`/list-items/${list_item_id}`);
    }
    case "json": {
      return res.send(comment);
    }
    default:
      res.send(comment);
  }
}

export async function updateOne(req, res) {
  const { comment_id } = req.params;
  const { _action, content } = req.body;
  const { redirect_uri } = req.query;

  const accept = req.accepts();

  switch (_action) {
    case "delete": {
      await CommentService.deleteOne(comment_id);
      break;
    }
    default:
      await CommentService.updateOne(comment_id, { content });
  }

  switch (accept.type(["html", "json"])) {
    case "html": {
      res.redirect(redirect_uri);
      break;
    }
    case "json": {
      res.send();
      break;
    }
    default:
      res.send();
  }
}

export async function deleteOne(req, res) {
  const id = req.params.comment_id;
  await CommentService.deleteOne(id);
  res.send({ id });
}
