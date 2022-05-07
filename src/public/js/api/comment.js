import { request } from "../utils.js";

export function comment(prefix) {
  return {
    createOne: (comment) => request(prefix, { body: comment, headers: { Accept: "text/html" } }),
    deleteOne: (id) =>
      request(`${prefix}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "text/plain",
        },
      }),
  };
}
