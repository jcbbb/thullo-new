import { User } from "../models/user.model.js";
import { randomBytes } from "crypto";

export async function getOne(id) {
  return await User.query().findById(id).select("id", "email", "name", "verified");
}

export async function getMany({ q }) {
  return await User.query().where("name", "ilike", `%${q}%`).orWhere("email", "ilike", `%${q}%`);
}

export async function getByEmail(email) {
  return await User.query().findOne({ email });
}

export function createOne(trx) {
  return async ({ email, password = randomBytes(12).toString("hex"), name }) => {
    return await User.query(trx).insert({ email, password, name });
  };
}
