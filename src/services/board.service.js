import { formatRelations, isValidUUID } from "../utils/index.js";
import { Board, User } from "../models/index.js";
import { InternalError, ResourceNotFoundError } from "../utils/errors.js";

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

export async function addLabel({ board_id, label_color_id, title }) {
  if (!title && !label_color_id) return;
  return await Board.relatedQuery("labels").for(board_id).insert({ label_color_id, title });
}

export function addMember(trx) {
  return async ({ user_id, board_id }) => {
    return await Board.relatedQuery("members", trx).for(board_id).relate(user_id);
  };
}

export async function getOne(id, relations = [], from) {
  if (!isValidUUID(id)) {
    throw new ResourceNotFoundError(`Resource with id of ${id} not found`, "404.html");
  }

  return await Board.query()
    .findById(id)
    .withGraphFetched(formatRelations(relations))
    .modifyGraph("invitations", (builder) => builder.where({ from }));
}

export async function updateOne(id, update) {
  return await Board.query().patchAndFetchById(id, update);
}
