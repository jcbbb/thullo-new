import base64url from "base64url";
import crypto from "crypto";

function generateChallenge(len = 32) {
  const buf = crypto.randomBytes(len);
  return base64url(buf);
}

function getUserId() {
  const id = crypto.randomUUID();
  return base64url(id);
}

export class AttestationChallenge {
  constructor({ provider, user }) {
    this.challenge = generateChallenge();
    this.rp = {
      name: provider.title,
      id: provider.rp_id,
    };
    this.user = {
      id: getUserId(),
      displayName: user.displayName || user.name,
      ...user,
    };
    this.timeout = 60000;
    this.attestation = "direct";
    this.pubKeyCredParams = [
      {
        type: "public-key",
        alg: -7,
      },
    ];
  }

  static from({ provider, user }) {
    return new AttestationChallenge({ provider, user });
  }
}
