import { request } from "../utils.js";

export function comment(prefix) {
  return {
    createOne: (comment) => request(prefix, { body: comment, headers: { Accept: "text/html" } }),
    deleteOne: (id) =>
      request(`${prefix}/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "text/plain",
        },
      }),
  };
}
