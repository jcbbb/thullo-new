import { List } from "../models/index.js";

export async function createOne({ board_id, title, pos }) {
  return await List.query().insert({ board_id, title, pos });
}

export async function deleteOne(id) {
  return await List.query().deleteById(id);
}

export async function updateOne({ board_id, id, update }) {
  const trx = await List.startTransaction();
  const { pos, ...otherUpdates } = update;
  try {
    const current = await getOne(id);
    if (Number(pos) < current.pos) {
      await List.query(trx)
        .where({ board_id })
        .where("pos", ">=", Number(pos))
        .andWhere("pos", "<", current.pos)
        .increment("pos", 1);
      await current.$query(trx).patch({ pos });
    }

    if (Number(pos) > current.pos) {
      await List.query(trx)
        .where({ board_id })
        .where("pos", "<=", Number(pos))
        .andWhere("pos", ">", current.pos)
        .decrement("pos", 1);
      await current.$query(trx).patch({ pos });
    }

    await current.$query(trx).patch(otherUpdates);

    await trx.commit();
  } catch (err) {
    console.log(err);
    trx.rollback();
    throw new InternalError();
  }
}

export async function getOne(id) {
  return await List.query().findById(id);
}
