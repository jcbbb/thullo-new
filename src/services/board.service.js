import { formatRelations } from "../utils/index.js";
import { Board, User } from "../models/index.js";
import { InternalError } from "../utils/errors.js";

export async function createOne(board) {
  const trx = await Board.startTransaction();
  try {
    const inserted = await Board.query(trx).insert(board);
    await addMember(trx)({ user_id: board.creator_id, board_id: inserted.id });
    await trx.commit();
  } catch (err) {
    trx.rollback();
    throw new InternalError();
  }
}

export function getMany(query) {
  return {
    async for(user_id) {
      return await User.relatedQuery("boards").for(user_id).withGraphFetched("members");
    },
  };
}

export function addMember(trx) {
  return async ({ user_id, board_id }) => {
    return await Board.relatedQuery("members", trx).for(board_id).relate(user_id);
  };
}

export async function getOne(id, relations = [], from) {
  if (!id) return;
  return await Board.query()
    .findById(id)
    .withGraphFetched(formatRelations(relations))
    .modifyGraph("invitations", (builder) => builder.where({ from }));
}

export async function updateOne(id, update) {
  return await Board.query().patchAndFetchById(id, update);
}
