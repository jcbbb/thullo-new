import * as BoardService from "../services/board.service.js";
import { initials } from "../utils/index.js";

export async function getIndex(req, res) {
  const user = req.user;
  const boards = await BoardService.getMany().for(user.id);

  res.render("home", {
    user,
    xhr: req.xhr,
    boards,
    initials,
  });
}
