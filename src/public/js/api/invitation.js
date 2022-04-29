import { request } from "../utils.js";

export function invitation(prefix) {
  return {
    createOne: (body) => request(prefix, { body }),
  };
}
