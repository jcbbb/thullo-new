import { User } from "../models/user.model.js";

export async function getOne(id) {
  return await User.query().findById(id).select("id", "email", "name", "verified");
}
