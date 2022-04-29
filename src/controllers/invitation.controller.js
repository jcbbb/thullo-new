import * as InvitationService from "../services/invitation.service.js";
import * as BoardService from "../services/board.service.js";
import * as UserService from "../services/user.service.js";
import { formatter, option } from "../utils/index.js";

export async function getOne(req, res) {}

export async function createOne(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const email = req.body.email;
  const accept = req.accepts();
  const user = req.user;

  const [invitee, err] = await option(UserService.getByEmail(email));

  if (err) {
    switch (accept.type(["json", "html"])) {
      case "html": {
        req.flash("err", err);
        return res.redirect(req.url);
      }
      case "json": {
        return res.code(err.status_code).send(err);
      }
    }
  }

  const invitation = await InvitationService.createOne({ to: invitee.id, board_id, from: user.id });

  switch (accept.type(["json", "html"])) {
    case "html": {
      return res.redirect(`/boards/${board_id}/invitations`);
    }
    case "json": {
      return res.send(invitation);
    }
  }
  res.send();
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

export async function getBoardInvitations(req, res) {
  const user = req.user;
  const board_id = req.params.board_id || req.query.board_id;
  const board = await BoardService.getOne(board_id, ["invitations.[invitee]"], user.id);
  res.render("invitation/board-invitations", { user, board, formatter });
}

export async function getUserInvitations(req, res) {
  const user = req.user;
  const invitations = await InvitationService.getUserInvitations(user.id, ["board", "sender"]);
  res.render("invitation/user-invitations", { user, invitations, formatter });
}

export async function updateOne(req, res) {
  const { _action, status } = req.body;
  const { redirect_uri } = req.query;
  const invite_id = req.params.invite_id || req.body.invite_id;

  switch (_action) {
    case "cancel":
      await InvitationService.deleteOne(invite_id);
      break;
    default:
      await InvitationService.updateOne(invite_id, { status });
  }

  res.redirect(redirect_uri);
}

export async function deleteOne(req, res) {
  const invite_id = req.params.invite_id;
  await InvitationService.deleteOne(invite_id);
  res.render(`/boards/`);
}
