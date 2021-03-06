import { request } from "../utils.js";

export function attachment(prefix) {
  return {
    deleteOne: (id) =>
      request(`${prefix}/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "text/plain",
        },
      }),
  };
}
