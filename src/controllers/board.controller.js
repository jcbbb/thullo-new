import * as BoardService from "../services/board.service.js";

export async function getNew(req, res) {
  res.render("board/new-board", { method: "post" }, { layout: "layout.html" });
}

export async function createOne(req, res) {
  const { title, description, visibility } = req.body;
  const user = req.user;
  const board = await BoardService.createOne({
    title,
    description,
    creator_id: user.id,
    visibility,
  });

  res.redirect("/");
}

export async function addMember(req, res) {
  const { user_id, board_id } = req.body;
  await BoardService.addMember({ user_id, board_id });
  res.redirect("/");
}
