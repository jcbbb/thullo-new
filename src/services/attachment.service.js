import { Attachment } from "../models/attachment.model.js";

export async function createOne({ attachment, list_item_id, board_id }) {
  return await Attachment.query().insert({ board_id, list_item_id, ...attachment });
}
