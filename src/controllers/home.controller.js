import * as BoardService from "../services/board.service.js";

export async function getIndex(req, res) {
  const user = req.user;
  const boards = await BoardService.getMany({ creator_id: user.id });

  res.render("home", {
    user,
    xhr: req.xhr,
    boards,
  });
}
