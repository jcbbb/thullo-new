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
  signup,
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
  const user = Object.fromEntries(new FormData(signupForm));

  if (shouldEnable) {
    const credentialRequest = await requestCredential(user);
    credentialRequest.challenge = base64url.decode(credentialRequest.challenge);
    credentialRequest.user.id = base64url.decode(credentialRequest.user.id);

    const credential = await window.navigator.credentials.create({
      publicKey: credentialRequest,
    });

    const [result, err] = await option(registerCredential(credential, user));
    if (err) {
      toast(err.message, "err");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get("return_to") || "/";
  } else {
    const [result, err] = await option(signup(user));
    if (err) {
      toast(err.message, "err");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get("return_to") || "/";
  }
});

async function registerCredential(credential, user) {
  const [rawId, attestationObject, clientDataJSON] = await Promise.all([
    base64url.encode(credential.rawId),
    base64url.encode(credential.response.attestationObject),
    base64url.encode(credential.response.clientDataJSON),
  ]);

  return await createCredential({
    id: credential.id,
    rawId,
    type: credential.type,
    response: {
      attestationObject,
      clientDataJSON,
    },
    transports: credential.response.getTransports(),
    user,
  });
}

function formatAssertionRequest(assertion) {
  assertion.allowCredentials = assertion.allowCredentials.map((credential) => ({
    ...credential,
    id: base64url.decode(credential.id),
  }));
  assertion.challenge = base64url.decode(assertion.challenge);
  return assertion;
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
    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get("return_to") || "/";
    return;
  }

  const [assertionRequest, assertionRequestErr] = await option(requestAssertion(user));

  if (assertionRequestErr) {
    toast(assertionRequestErr.message, "err");
    return;
  }

  const assertion = await window.navigator.credentials.get({
    publicKey: formatAssertionRequest(assertionRequest),
  });

  const [result, err] = await option(assert(assertion, user));

  if (err) {
    toast(err.message, "err");
    return;
  }
  const params = new URLSearchParams(window.location.search);
  window.location.href = params.get("return_to") || "/";
});

async function assert(assertion, user) {
  const [rawId, authenticatorData, clientDataJSON, signature, userHandle] = await Promise.all([
    base64url.encode(assertion.rawId),
    base64url.encode(assertion.response.authenticatorData),
    base64url.encode(assertion.response.clientDataJSON),
    base64url.encode(assertion.response.signature),
    base64url.encode(assertion.response.userHandle),
  ]);

  return await verifyAssertion({
    id: assertion.id,
    rawId,
    response: {
      authenticatorData,
      clientDataJSON,
      signature,
      userHandle,
    },
    user,
  });
}
