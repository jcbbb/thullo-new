import * as BoardService from "../services/board.service.js";
import { normalizeBody } from "../utils/index.js";
import * as S3Service from "../services/s3.service.js";

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
  const cover_photo_url = await S3Service.upload(cover);
  const user = req.user;
  const board = await BoardService.createOne({
    title,
    creator_id: user.id,
    visibility,
    cover_photo_url,
  });

  if (req.xhr) return res.render("board/board-card.html", board);

  res.redirect("/");
}

export async function addMember(req, res) {
  const board_id = req.params.board_id;
  const { user_id } = req.body;
  await BoardService.addMember({ user_id, board_id });
  res.redirect("/");
}

export async function getOne(req, res) {
  const user = req.user;
  const board_id = req.params.board_id;
  const board = await BoardService.getOne(board_id, ["lists.[items]", "members", "creator"]);
  res.render("board/single-board", { board, user });
}

export async function updateOne(req, res) {
  const board_id = req.params.board_id;
  const { visibility, title, description, cover } = normalizeBody(req.body);
  await BoardService.updateOne(board_id, { visibility, title, description, cover });
  res.redirect(`/boards/${board_id}`);
}
