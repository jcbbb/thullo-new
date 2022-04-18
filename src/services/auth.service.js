import * as SessionService from "../services/session.service.js";
import * as UserService from "../services/user.service.js";
import * as AuthProviderService from "../services/auth-provider.service.js";
import * as CredentialService from "../services/credential.service.js";
import {
  ResourceNotFoundError,
  BadRequestError,
  ValidationError,
  InternalError,
} from "../utils/errors.js";
import { User } from "../models/user.model.js";
import {
  CredentialRequest,
  parseAuthData,
  AssertionRequest,
  parseAuthenticatorData,
  hash,
  ASN1toPEM,
  verifySignature,
  getDomainWithoutSubdomain,
} from "../utils/webauthn.js";
import base64url from "base64url";
import cbor from "cbor";

export async function signup({ password, name, email, provider_name, user_agent }) {
  const trx = await User.startTransaction();
  try {
    const user = await UserService.createOne(trx)({
      password,
      email,
      name,
    });
    const session = await SessionService.createOne(trx)({
      user_id: user.id,
      provider_name,
      user_agent,
    });
    await trx.commit();
    return { session, user };
  } catch (err) {
    trx.rollback();
    throw new InternalError();
  }
}
export async function signupWithCredential({
  email,
  name,
  credential_id,
  public_key,
  sign_count,
  transports,
  user_agent,
  password,
}) {
  const trx = await User.startTransaction();
  try {
    const user = await UserService.createOne(trx)({
      name,
      email,
      password,
    });

    const session = await SessionService.createOne(trx)({
      user_id: user.id,
      provider_name: "webauthn",
      user_agent,
    });

    const credential = await CredentialService.createOne(trx)({
      user_id: user.id,
      credential_id,
      public_key,
      sign_count,
      transports,
    });
    await trx.commit();
    return { credential, session, user };
  } catch (err) {
    trx.rollback();
    throw new InternalError();
  }
}
export async function loginWithCredential({ user_agent, credential }) {
  const user = await UserService.getOne(credential.user_id);
  const session = await SessionService.createOne()({
    user_id: user.id,
    provider_name: "webauthn",
    user_agent,
  });

  return { session, user };
}

export async function login({ email, password, provider_name, user_agent }) {
  const user = await UserService.getByEmail(email);

  if (!user) throw new ResourceNotFoundError(`User with email ${email} not found`, "auth/login");

  const isValid = await user.verifyPassword(password);

  if (!isValid)
    throw new BadRequestError(
      "Invalid email or password. Maybe you logged in with social media?",
      "auth/login"
    );

  const session = await SessionService.createOne()({
    user_id: user.id,
    provider_name,
    user_agent,
  });

  return { user, session };
}

export async function createCredentialRequest(user) {
  const provider = await AuthProviderService.getByName("webauthn");
  return CredentialRequest.from({ provider, user });
}

export async function createAssertionRequest(user) {
  return await AssertionRequest.from(user.email);
}

export function clientDataValidator(type) {
  return async function validateClientData(credential, challenge) {
    const provider = await AuthProviderService.getByName("webauthn");
    const clientData = JSON.parse(base64url.decode(credential.response.clientDataJSON));

    if (clientData.type !== type) {
      throw new ValidationError(`Attestation type is in correct for creating a credential`);
    }

    if (clientData.challenge !== challenge) {
      throw new ValidationError(`Attestation challenges don't match`);
    }

    const origin = getDomainWithoutSubdomain(clientData.origin);

    if (origin !== provider.rp_id) {
      throw new ValidationError(
        `Unexpected client data origin ${clientData.origin}, expected ${provider.rp_id}`
      );
    }

    return clientData;
  };
}

export function validateAttestationResponse(credential) {
  try {
    const attestationBuffer = base64url.toBuffer(credential.response.attestationObject);
    const attestationObject = cbor.decodeAllSync(attestationBuffer)[0];
    const result = parseAuthData(attestationObject.authData);

    if (result.credIDLen > 1023) {
      throw new ValidationError("CredentialID length is too long");
    }

    if (!result.flags.up) {
      throw new ValidationError("User was not present during attestation");
    }

    return [result, null];
  } catch (err) {
    return [null, new ValidationError(err.message)];
  }
}

export async function validateAssertionResponse(assertion, credential) {
  try {
    const authenticatorData = base64url.toBuffer(assertion.response.authenticatorData);
    const authData = parseAuthenticatorData(authenticatorData);
    if (!authData.flags.up) {
      throw new ValidationError("User was not present during attestation");
    }
    const clientDataHash = hash(base64url.toBuffer(assertion.response.clientDataJSON));
    const signatureBase = Buffer.concat([authenticatorData, clientDataHash]);
    const publicKey = ASN1toPEM(base64url.toBuffer(credential.public_key));
    const signature = base64url.toBuffer(assertion.response.signature);
    const isValid = verifySignature(signature, signatureBase, publicKey);

    if (!isValid) {
      throw new ValidationError(`Unable to verifiy signature`);
    }

    if (authData.signCount <= credential.sign_count) {
      throw new ValidationError(`Authenticator counter did not increase`);
    }

    return [authData, null];
  } catch (err) {
    return [null, new ValidationError(err.message)];
  }
}
