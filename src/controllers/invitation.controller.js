import * as InvitationService from "../services/invitation.service.js";

export async function getOne(req, res) {}

export async function createOne(req, res) {
  const { user_id, board_id } = req.body;
  await InvitationService.createOne({ user_id, board_id });
  res.redirect(`/boards/${board_id}`);
}
