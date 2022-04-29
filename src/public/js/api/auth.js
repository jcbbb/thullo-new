import { request } from "../utils.js";
export function auth(prefix) {
  return {
    signup: (user) => request(`${prefix}/signup`, { body: user }),
    login: (user) => request(`${prefix}/login`, { body: user }),
    checkExisting: (email) => {
      return request(`${prefix}/credentials/${email}`, {
        method: "head",
        headers: {
          Accept: undefined,
        },
      });
    },
    verifyAssertion: (body) => request(`${prefix}/assertions`, { body }),
    createCredential: (body) => request(`${prefix}/credentials`, { body }),
    requestAssertion: (body) => request(`${prefix}/requests?type=webauthn.get`, { body }),
    requestCredential: (body) => request(`${prefix}/requests?type=webauthn.create`, { body }),
  };
}
