import { request } from "../utils.js";

export function listItem(prefix) {
  return {
    updateOne: (id, update) => request(`${prefix}/${id}`, { body: update, method: "PATCH" }),
  };
}
