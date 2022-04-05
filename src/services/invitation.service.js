import { Invitation } from "../models/invitation.model.js";

export async function createOne({ user_id, board_id }) {
  return await Invitation.query().insert({ user_id, board_id });
}
