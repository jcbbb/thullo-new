import { request } from "../utils.js";

export function requestCredential(body) {
  return request("/auth/requests?type=webauthn.create", { body });
}

export function requestAssertion(body) {
  return request("/auth/requests?type=webauthn.get", { body });
}

export function createCredential(body) {
  return request(`/auth/credentials`, { body });
}

export function verifyAssertion(body) {
  return request(`/auth/assertions`, { body });
}

export function checkExisting(email) {
  return request(`/auth/credentials/${email}`, { method: "head", json: false });
}

export function login(user) {
  return request(`/auth/login`, { body: user });
}
