import { LabelColor } from "../models/index.js";

export async function getMany() {
  return await LabelColor.query();
}
