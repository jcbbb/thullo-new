import * as InvitationService from "../services/invitation.service.js";
import * as BoardService from "../services/board.service.js";
import * as UserService from "../services/user.service.js";
import { asyncPipe, formatter, option, prop } from "../utils/index.js";

export async function getOne(req, res) {}

export async function create(req, res) {
  const board_id = req.params.board_id || req.body.board_id;
  const invites = [req.body.invites].flat().filter(Boolean);
  const accept = req.accepts();
  const user = req.user;

  const inviteUser = asyncPipe(
    UserService.getByEmail,
    prop("id"),
    InvitationService.createFrom(user.id, board_id)
  );

  const [invitations, err] = await option(Promise.all(invites.map(inviteUser)));

  switch (accept.type(["json", "html"])) {
    case "html": {
      if (err) {
        req.flash("err", err);
        return res.redirect(req.url);
      }
      return res.redirect(`/boards/${board_id}/invitations`);
    }
    case "json": {
      if (err) return res.code(err.status_code).send(err);
      return res.send(invitations);
    }
  }
  res.send();
}

export async function getNew(req, res) {
  const user = req.user;
  const board_id = req.params.board_id || req.query.board_id;
  const q = req.query.q;
  const board = await BoardService.getOne(board_id);
  const suggestions = await UserService.getMany({ q, excludes: [user.id] });

  res.render(
    "invitation/new-invitation.html",
    { method: "post", title: "Invite to board", user, board, suggestions },
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
  const { h } = req.query; // h -> highlight
  const invitations = await InvitationService.getUserInvitations(user.id, ["board", "sender"]);
  res.render("invitation/user-invitations", { user, invitations, formatter, h });
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
