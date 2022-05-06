import { formatRelations } from "../utils/index.js";
import { Invitation } from "../models/index.js";
import { InternalError } from "../utils/errors.js";
import * as BoardService from "../services/board.service.js";

export async function createOne({ to, board_id, from }) {
  return await Invitation.query()
    .insert({ to, board_id, from })
    .onConflict(["to", "board_id"])
    .ignore();
}

export function createFrom(from, board_id) {
  return async function to(to) {
    return await Invitation.query()
      .insert({ to, board_id, from })
      .onConflict(["to", "board_id"])
      .ignore();
  };
}

export async function getBoardInvitations(board_id, relations = []) {
  return await Invitation.query().where({ board_id }).withGraphFetched(formatRelations(relations));
}

export async function getMany({ board_id, to }, relations = []) {
  return await Invitation.query()
    .where({ board_id, to })
    .withGraphFetched(formatRelations(relations))
    .skipUndefined();
}

export async function getUserInvitations(to, relations = []) {
  return await Invitation.query()
    .where({ to, status: "PENDING" })
    .withGraphFetched(formatRelations(relations));
}

export async function updateOne(id, update) {
  const { status } = update;
  const invite = await Invitation.query().findById(id);
  const trx = await Invitation.startTransaction();
  try {
    if (status && status === "ACCEPTED") {
      await BoardService.addMember(trx)({ user_id: invite.to, board_id: invite.board_id });
    }
    const invitation = await Invitation.query(trx).patchAndFetchById(id, update);
    await trx.commit();
    return invitation;
  } catch (err) {
    console.log(err);
    trx.rollback();
    throw new InternalError();
  }
}

export async function deleteOne(id) {
  return await Invitation.query().deleteById(id);
}
