import { selectOne } from "./utils.js";

const loginForm = selectOne("login-form");
const signupForm = selectOne("signup-form");
const passwordlessDialog = selectOne("passwordless-dialog");

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  passwordlessDialog.showModal();
});

function formatAttestation(attestation) {
  attestation.challenge = bufferDecode(attestation.challenge);
  attestation.user.id = bufferDecode(attestation.user.id);
  return attestation;
}

function bufferDecode(buf) {
  return Uint8Array.from(buf, (c) => c.charCodeAt(0));
}

function bufferEncode(buf) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buf]);
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      const base64 = e.target.result.substring(e.target.result.indexOf(",") + 1);
      const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      resolve(base64url);
    });

    reader.addEventListener("error", reject);

    reader.readAsDataURL(blob);
  });
}

passwordlessDialog?.addEventListener("close", async (e) => {
  const shouldEnable = e.target.returnValue === "yes";
  if (shouldEnable) {
    const form = selectOne("challenge-form", e.target);
    const resp = await fetch(form.action, {
      method: "post",
      body: new FormData(signupForm),
    });
    const attestation = await resp.json();

    const credential = await window.navigator.credentials.create({
      publicKey: formatAttestation(attestation),
    });
    await register(credential);
  }
});

async function register(credential) {
  const [rawId, attestationObject, clientDataJSON] = await Promise.all([
    bufferEncode(credential.rawId),
    bufferEncode(credential.response.attestationObject),
    bufferEncode(credential.response.clientDataJSON),
  ]);

  await fetch("/auth/verify-credentials", {
    method: "post",
    body: JSON.stringify({
      id: credential.id,
      rawId,
      type: credential.type,
      response: {
        attestationObject,
        clientDataJSON,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
