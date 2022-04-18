import base64url from "base64url";
import crypto from "crypto";
import cbor from "cbor";
import { getByEmail } from "../services/user.service.js";

export const WEBAUTHN_TYPES = {
  CREATE: "webauthn.create",
  GET: "webauthn.get",
};

function generateChallenge(len = 32) {
  return base64url.encode(crypto.randomBytes(len));
}

function getUserId() {
  const id = crypto.randomUUID();
  return base64url.encode(id);
}

export class CredentialRequest {
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
    this.attestation = "none";
    this.pubKeyCredParams = [
      {
        type: "public-key",
        alg: -7,
      },
    ];
  }

  static from({ provider, user }) {
    return new CredentialRequest({ provider, user });
  }
}

export class AssertionRequest {
  constructor({ credentials = [] }) {
    this.challenge = generateChallenge();
    this.allowCredentials = credentials.map((credential) => ({
      id: credential.credential_id,
      type: "public-key",
      transports: credential.transports,
    }));
    this.timeout = 60000;
  }

  static async from(email) {
    const user = await getByEmail(email, ["credentials"]);
    return new AssertionRequest({ credentials: user.credentials });
  }
}

export class AttestationResponse {
  constructor(credential) {}

  static from(credential) {
    return new AttestationResponse(credential);
  }
}

function COSEECDHAtoPKCS(COSEPublicKey) {
  let coseStruct = cbor.decodeAllSync(COSEPublicKey)[0];
  let tag = Buffer.from([0x04]);
  let x = coseStruct.get(-2);
  let y = coseStruct.get(-3);

  return Buffer.concat([tag, x, y]);
}

export function ASN1toPEM(pkBuffer) {
  if (!Buffer.isBuffer(pkBuffer)) throw new Error("ASN1toPEM: pkBuffer must be Buffer.");

  let type;
  if (pkBuffer.length == 65 && pkBuffer[0] == 0x04) {
    pkBuffer = Buffer.concat([
      new Buffer.from("3059301306072a8648ce3d020106082a8648ce3d030107034200", "hex"),
      pkBuffer,
    ]);

    type = "PUBLIC KEY";
  } else {
    type = "CERTIFICATE";
  }

  let b64cert = pkBuffer.toString("base64");

  let PEMKey = "";
  for (let i = 0; i < Math.ceil(b64cert.length / 64); i++) {
    let start = 64 * i;

    PEMKey += b64cert.substr(start, 64) + "\n";
  }

  PEMKey = `-----BEGIN ${type}-----\n` + PEMKey + `-----END ${type}-----\n`;

  return PEMKey;
}

export function hash(data) {
  return crypto.createHash("SHA256").update(data).digest();
}

export function verifySignature(signature, data, publicKey) {
  return crypto.createVerify("SHA256").update(data).verify(publicKey, signature);
}

export function parseAuthData(buffer) {
  const rpIdHash = buffer.slice(0, 32);
  buffer = buffer.slice(32);
  const flagsBuf = buffer.slice(0, 1);
  buffer = buffer.slice(1);
  const flagsInt = flagsBuf[0];

  const flags = {
    up: !!(flagsInt & 0x01), // user presence
    uv: !!(flagsInt & 0x04), // user verification
    at: !!(flagsInt & 0x40), // attestation data
    ed: !!(flagsInt && 0x80), // extension data
  };

  const signCountBuf = buffer.slice(0, 4);
  buffer = buffer.slice(4);
  const signCount = signCountBuf.readUInt32BE(0);
  const aaguid = buffer.slice(0, 16);
  buffer = buffer.slice(16);
  const credIDLenBuf = buffer.slice(0, 2);
  buffer = buffer.slice(2);
  const credIDLen = credIDLenBuf.readUInt16BE(0);
  const credIDBuf = buffer.slice(0, credIDLen);
  buffer = buffer.slice(credIDLen);

  const COSEPublicKey = buffer.slice(0, credIDLen);

  return {
    rpIdHash,
    flags,
    signCount,
    aaguid,
    credIDBuf,
    COSEPublicKey,
    publicKey: base64url.encode(COSEECDHAtoPKCS(COSEPublicKey)),
    credID: base64url.encode(credIDBuf),
  };
}

export function parseAuthenticatorData(buffer) {
  const rpIdHash = buffer.slice(0, 32);
  buffer = buffer.slice(32);
  const flagsBuf = buffer.slice(0, 1);
  buffer = buffer.slice(1);
  const flagsInt = flagsBuf[0];
  const flags = {
    up: !!(flagsInt & 0x01), // user presence
    uv: !!(flagsInt & 0x04), // user verification
    at: !!(flagsInt & 0x40), // attestation data
    ed: !!(flagsInt && 0x80), // extension data
  };

  const signCountBuf = buffer.slice(0, 4);
  buffer = buffer.slice(4);
  const signCount = signCountBuf.readUInt32BE(0);

  return { rpIdHash, flagsBuf, flags, flagsInt, signCount, signCountBuf };
}

export function getDomainWithoutSubdomain(url) {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
}
