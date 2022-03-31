import { Board } from "../models/board.model.js";

export async function createOne(board) {
  return await Board.query().insert(board);
}

export async function getMany({ creator_id }) {
  return await Board.query().where({ creator_id }).withGraphFetched("members");
}

export async function addMember({ user_id, board_id }) {
  return await Board.relatedQuery("members").for(board_id).relate(user_id);
}