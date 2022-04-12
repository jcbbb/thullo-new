import * as InvitationService from "../services/invitation.service.js";
import * as BoardService from "../services/board.service.js";
import * as UserService from "../services/user.service.js";
import { formatter } from "../utils/index.js";

export async function getOne(req, res) {}

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const email = req.body.email;
  const user = await UserService.getByEmail(email);
  if (!user) throw new Error("User not found");
  await InvitationService.createOne({ user_id: user.id, board_id });
  res.redirect(`/boards/${board_id}/invitations`);
}

export async function getNew(req, res) {
  const user = req.user;
  const board_id = req.params.board_id || req.query.board_id;
  const board = await BoardService.getOne(board_id);
  res.render(
    "invitation/new-invitation.html",
    { method: "post", title: "Invite to board", user, board },
    { layout: "layout.html" }
  );
}

export async function getMany(req, res) {
  const user = req.user;
  const board_id = req.params.board_id || req.query.board_id;
  const board = await BoardService.getOne(board_id);
  const invitations = await InvitationService.getMany({ board_id: board.id }, ["to"]);
  res.render("invitation/invitations", { board, user, invitations, formatter });
}

export async function updateOne(req, res) {
  const { _action, email, board_id } = req.body;
  const invite_id = req.params.invite_id;

  switch (_action) {
    case "cancel":
      await InvitationService.deleteOne(invite_id);
      break;
    default:
      const user = await UserService.getByEmail(email);
      await InvitationService.updateOne(id, { user_id: user.id });
  }

  res.redirect(`/boards/${board_id}/invitations`);
}

export async function deleteOne(req, res) {
  const invite_id = req.params.invite_id;
  await InvitationService.deleteOne(invite_id);
  res.render(`/boards/`);
}
