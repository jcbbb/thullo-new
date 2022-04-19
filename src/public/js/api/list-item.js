import { request } from "../utils.js";

export function updateListItem(id, update) {
  return request(`/list-items/${id}`, { body: update });
}
