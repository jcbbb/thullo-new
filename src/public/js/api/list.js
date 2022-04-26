import { request } from "../utils.js";

export function list(prefix) {
  return {
    updateOne: (id, update) => request(`${prefix}/${id}`, { body: update }),
  };
}
