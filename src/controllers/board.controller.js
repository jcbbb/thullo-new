import * as BoardService from "../services/board.service.js";
import * as S3Service from "../services/s3.service.js";
import * as LabelColorService from "../services/label-color.service.js";
import { normalizeBody } from "../utils/index.js";
import { formatter, initials, option } from "../utils/index.js";

export async function getNew(req, res) {
  const user = req.user;
  res.render(
    "board/new-board",
    { method: "post", title: "Create board", user },
    { layout: "layout.html" }
  );
}

export async function createOne(req, res) {
  const { title, visibility, cover } = normalizeBody(req.body);
  const { url: cover_photo_url } = await S3Service.upload(cover);
  const user = req.user;
  await BoardService.createOne({
    title,
    creator_id: user.id,
    visibility,
    cover_photo_url,
  });

  res.redirect("/");
}

export async function addMember(req, res) {
  const board_id = req.params.board_id;
  const { user_id } = req.body;
  await BoardService.addMember()({ user_id, board_id });
  res.redirect("/");
}

export async function getOne(req, res) {
  const user = req.user;
  const board_id = req.params.board_id;
  const [board, err] = await option(
    BoardService.getOne(board_id, [
      "lists.[items.[attachments, labels.[color], comments.[user]]]",
      "members",
      "creator",
      "labels.[color]",
    ])
  );

  if (err) {
    req.flash("err", err);
    return res.code(err.status_code).render(err.view);
  }

  const colors = await LabelColorService.getMany();

  res.render("board/single-board", { board, user, formatter, initials, colors });
}

export async function updateOne(req, res) {
  const board_id = req.params.board_id;
  const { visibility, title, description, cover } = normalizeBody(req.body);
  await BoardService.updateOne(board_id, { visibility, title, description, cover });
  res.redirect(`/boards/${board_id}`);
}
