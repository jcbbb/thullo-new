import { User } from "../models/index.js";
import { randomBytes } from "crypto";
import { formatRelations } from "../utils/index.js";

export async function getOne(id) {
  return await User.query().findById(id);
}

export async function getMany({ q, limit = 10, excludes = [] }) {
  if (!q) return [];
  return await User.query()
    .where("name", "ilike", `%${q}%`)
    .whereNotIn("id", excludes)
    .orWhere("email", "ilike", `%${q}%`)
    .whereNotIn("id", excludes)
    .limit(Math.min(limit, 100));
}

export async function getByEmail(email, relations = []) {
  return await User.query().findOne({ email }).withGraphFetched(formatRelations(relations));
}

export async function hasCredentials(email) {
  const user = await getByEmail(email, ["credentials"]);
  return !!user?.credentials?.length;
}

export function createOne(trx) {
  return async ({ email, password = randomBytes(12).toString("hex"), name }) => {
    return await User.query(trx).insert({ email, password, name });
  };
}
