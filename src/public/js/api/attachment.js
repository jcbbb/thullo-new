import { request } from "../utils.js";

export function deleteOne(id) {
  return request(`/attachments/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
