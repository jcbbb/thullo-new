import { request } from "../utils.js";

export function invitation(prefix) {
  return {
    create: (body) => request(prefix, { body }),
  };
}
