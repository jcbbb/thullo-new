import * as BoardService from "../services/board.service.js";
import { normalizeBody } from "../utils/index.js";
import * as S3Service from "../services/s3.service.js";

export async function getNew(req, res) {
  res.render(
    "board/new-board",
    { method: "post", title: "Create board" },
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
  const { user_id, board_id } = normalizeBody(req.body);
  await BoardService.addMember({ user_id, board_id });
  res.redirect("/");
}

export async function getOne(req, res) {
  const user = req.user;
  const id = req.params.id;
  const board = await BoardService.getOne(id);
  res.render("board/single-board", { board, user });
}

export async function updateOne(req, res) {
  const id = req.params.id;
  const { visibility, title, description, cover } = normalizeBody(req.body);
  await BoardService.updateOne(id, { visibility, title, description, cover });
  res.redirect(`/boards/${id}`);
}

export async function createList(req, res) {
  const id = req.params.id;
  const { title, order } = req.body;
  await BoardService.createList({ title, board_id: id, order });
  res.redirect(`/boards/${id}`);
}

export async function addListItem(req, res) {
  const { list_id, id } = req.params;
  const { title, order } = req.body;
  await BoardService.addListItem({ title, order, list_id });
  res.redirect(`/boards/${id}`);
}
