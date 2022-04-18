import { selectOne, option } from "./utils.js";
import * as base64url from "./base64-url.js";
import { toast } from "./toast.js";
import {
  requestCredential,
  requestAssertion,
  createCredential,
  checkExisting,
  login,
  verifyAssertion,
} from "./api/auth.js";

const loginForm = selectOne("login-form");
const signupForm = selectOne("signup-form");
const passwordlessDialog = selectOne("passwordless-dialog");

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  passwordlessDialog.showModal();
});

passwordlessDialog?.addEventListener("close", async (e) => {
  const shouldEnable = e.target.returnValue === "yes";

  if (shouldEnable) {
    const user = Object.fromEntries(new FormData(signupForm));
    const credentialRequest = await requestCredential(user);
    credentialRequest.challenge = base64url.decode(credentialRequest.challenge);
    credentialRequest.user.id = base64url.decode(credentialRequest.user.id);

    const credential = await window.navigator.credentials.create({
      publicKey: credentialRequest,
    });

    await register(credential, user);
  }
});

async function register(credential, user) {
  const [rawId, attestationObject, clientDataJSON] = await Promise.all([
    base64url.encode(credential.rawId),
    base64url.encode(credential.response.attestationObject),
    base64url.encode(credential.response.clientDataJSON),
  ]);

  const [result, err] = await option(
    createCredential({
      id: credential.id,
      rawId,
      type: credential.type,
      response: {
        attestationObject,
        clientDataJSON,
      },
      transports: credential.response.getTransports(),
      user,
    })
  );

  if (err) {
    toast(err.message, "err");
    return;
  }

  toast(result.message, "success");

  const params = new URLSearchParams(window.location.search);
  window.location.href = params.get("return_to") || "/";
}

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = Object.fromEntries(new FormData(e.target));
  const [existing, existingErr] = await option(checkExisting(user.email));

  if (!existing) {
    const [result, err] = await option(login(user));
    if (err) {
      toast(err.message, "err");
      return;
    }
  }

  const assertionRequest = await requestAssertion(user);

  assertionRequest.allowCredentials = assertionRequest.allowCredentials.map((credential) => ({
    ...credential,
    id: base64url.decode(credential.id),
  }));

  assertionRequest.challenge = base64url.decode(assertionRequest.challenge);

  const assertion = await window.navigator.credentials.get({
    publicKey: assertionRequest,
  });

  await assert(assertion, user);
});

async function assert(assertion, user) {
  const [rawId, authenticatorData, clientDataJSON, signature, userHandle] = await Promise.all([
    base64url.encode(assertion.rawId),
    base64url.encode(assertion.response.authenticatorData),
    base64url.encode(assertion.response.clientDataJSON),
    base64url.encode(assertion.response.signature),
    base64url.encode(assertion.response.userHandle),
  ]);

  const [result, err] = await option(
    verifyAssertion({
      id: assertion.id,
      rawId,
      response: {
        authenticatorData,
        clientDataJSON,
        signature,
        userHandle,
      },
      user,
    })
  );

  if (err) {
    toast(err.message, "err");
    return;
  }

  toast(result.message, "success");

  const params = new URLSearchParams(window.location.search);
  window.location.href = params.get("return_to") || "/";
}
