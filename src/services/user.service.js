import { User } from "../models/user.model.js";

export async function getOne(id) {
  return await User.query().findById(id).select("id", "email", "name", "verified");
}

export async function getMany({ q }) {
  return await User.query().where("name", "ilike", `%${q}%`).orWhere("email", "ilike", `%${q}%`);
}

export async function getByEmail(email) {
  return await User.query().findOne({ email });
}
