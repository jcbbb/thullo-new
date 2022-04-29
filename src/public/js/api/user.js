import { request } from "../utils.js";

export function user(prefix) {
  return {
    getMany: (query) => request(prefix, { query }),
  };
}
