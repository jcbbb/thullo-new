import * as AuthService from "../services/auth.service.js";
import * as AuthProviderService from "../services/auth-provider.service.js";
import * as GithubService from "../services/github.service.js";
import * as UserService from "../services/user.service.js";
import * as SessionService from "../services/session.service.js";
import * as GoogleService from "../services/google.service.js";
import * as CredentialService from "../services/credential.service.js";
import { encrypt, decrypt, option } from "../utils/index.js";
import { AuthenticationError } from "../utils/errors.js";
import { normalizeBody } from "../utils/index.js";
import { WEBAUTHN_TYPES } from "../utils/webauthn.js";

export async function createRequest(req, res) {
  const { type } = req.query;
  const { email, name } = normalizeBody(req.body);
  switch (type) {
    case WEBAUTHN_TYPES.CREATE: {
      const credRequest = await AuthService.createCredentialRequest({
        name: email,
        displayName: name,
      });
      req.session.set("challenge", credRequest.challenge);
      res.send(credRequest);
      break;
    }
    case WEBAUTHN_TYPES.GET: {
      const [assertionRequest, err] = await option(
        AuthService.createAssertionRequest({
          email,
        })
      );

      if (err) {
        return res.code(err.status_code).send(err);
      }

      req.session.set("challenge", assertionRequest.challenge);
      res.send(assertionRequest);
      break;
    }
  }
}

export async function createCredential(req, res) {
  const credential = req.body;
  const challenge = req.session.get("challenge");

  const validateClientData = AuthService.clientDataValidator(WEBAUTHN_TYPES.CREATE);
  const [clientResult, clientError] = await option(validateClientData(credential, challenge));

  if (clientError) {
    return res.code(clientError.status_code).send(clientError);
  }

  const [responseResult, responseError] = AuthService.validateAttestationResponse(credential);

  if (responseError) {
    return res.code(responseError.status_code).send(responseError);
  }

  const [result, err] = await option(
    AuthService.signupWithCredential({
      ...credential.user,
      public_key: responseResult.publicKey,
      sign_count: responseResult.signCount,
      credential_id: responseResult.credID,
      user_agent: req.headers["user-agent"],
      transports: credential.transports,
    })
  );

  if (err) {
    return res.code(err.status_code).send(err);
  }

  req.session.set("sid", result.session.id);
  res.send({ message: "Successfully created" });
}

export async function checkExisting(req, res) {
  const { email } = req.params;
  const hasCredentials = await UserService.hasCredentials(email);
  if (hasCredentials) return res.send();
  res.code(404).send();
}

export async function assertCredential(req, res) {
  const assertion = req.body;
  const challenge = req.session.get("challenge");
  const validateClientData = AuthService.clientDataValidator(WEBAUTHN_TYPES.GET);
  const [clientResult, clientError] = await option(validateClientData(assertion, challenge));

  if (clientError) {
    return res.code(clientError.status_code).send(clientError);
  }

  const credential = await CredentialService.getOne(assertion.id);
  const [responseResult, responseError] = await option(
    AuthService.validateAssertionResponse(assertion, credential)
  );

  await credential.$query().patch({ sign_count: responseResult.signCount });

  if (responseError) {
    return res.code(clientError.status_code).send(responseError);
  }

  const [result, err] = await option(
    AuthService.loginWithCredential({
      credential,
      user_agent: req.headers["user-agent"],
    })
  );

  if (err) {
    return res.code(err.status_code).send(err);
  }

  req.session.set("sid", result.session.id);

  res.send({ message: "Successfully verified the signature" });
}

export async function getSignup(req, res) {
  const { return_to = "/" } = req.query;
  const sid = req.session.get("sid");
  const err = res.flash("err");

  const hasValidSession = await SessionService.validateOne(sid);

  if (!hasValidSession) {
    const state = encrypt(JSON.stringify({ came_from: req.url, return_to }));
    const providers = await AuthProviderService.getMany();
    req.session.set("oauth_state", state);
    return res.render("/auth/signup", { providers, oauth_state: state, err, return_to });
  }

  res.redirect("/");
}

export async function getLogin(req, res) {
  const { return_to = "/" } = req.query;
  const sid = req.session.get("sid");
  const err = res.flash("err");

  const hasValidSession = await SessionService.validateOne(sid);

  if (!hasValidSession) {
    const state = encrypt(JSON.stringify({ came_from: req.url, return_to }));
    const providers = await AuthProviderService.getMany();
    req.session.set("oauth_state", state);
    return res.render("/auth/login", { providers, oauth_state: state, err, return_to });
  }

  res.redirect("/");
}

export async function signup(req, res) {
  const { return_to = "/" } = req.query;
  const { email, password, name, provider_name } = req.body;
  const user_agent = req.headers["user-agent"];

  const [result, err] = await option(
    AuthService.signup({ email, password, name, provider_name, user_agent })
  );

  if (err) {
    req.flash("err", err);
    return res.redirect(req.url);
  }

  req.session.set("sid", result.session.id);
  res.redirect(return_to);
}

export async function login(req, res) {
  const { return_to = "/" } = req.query;
  const { email, password, provider_name } = req.body;

  const user_agent = req.headers["user-agent"];
  const accept = req.accepts();

  const [result, err] = await option(
    AuthService.login({ email, password, provider_name, user_agent })
  );

  switch (accept.type(["html", "json"])) {
    case "html": {
      if (err) {
        req.flash("err", err);
        return res.redirect(req.url);
      }
      req.session.set("sid", result.sesion.id);
      res.redirect(return_to);
      break;
    }
    case "json": {
      if (err) {
        return res.code(err.status_code).send(err);
      }
      req.session.set("sid", result.sesion.id);
      res.send(result);
      break;
    }
  }
  res.send();
}

export async function logout(req, res) {
  const sid = req.session.get("sid");
  const [result, err] = await option(SessionService.deleteOne(sid));
  if (err) {
    req.flash("err", err);
    return res.redirect(req.url);
  }
  req.session.delete();
  res.redirect("/");
}

export async function githubCallback(req, res) {
  const { state, code } = req.query;
  const originalState = req.session.get("oauth_state");
  const decrypted = JSON.parse(decrypt(state));

  if (originalState !== state) {
    req.flash("err", new AuthenticationError("Oauth state does not match"));
    return res.redirect(decrypted.came_from);
  }

  const tokenData = await GithubService.getAccessToken({ code });
  const user = await GithubService.getUser(tokenData);
  const existing = await UserService.getByEmail(user.email);

  if (existing) {
    const [session, err] = await option(
      SessionService.createOne()({
        user_id: existing.id,
        provider_name: "github",
        user_agent: req.headers["user-agent"],
      })
    );
    if (err) {
      req.flash("err", err);
      return res.redirect(decrypted.came_from);
    }
    req.session.set("sid", session.id);
    return res.redirect(decrypted.return_to);
  }

  const [result, err] = await option(
    AuthService.signup({
      email: user.email,
      provider_name: "github",
      user_agent: req.headers["user-agent"],
      name: user.name || user.login,
    })
  );

  if (err) {
    req.flash("err", err);
    return res.redirect(decrypted.came_from);
  }

  req.session.set("sid", result.session.id);
  res.redirect(decrypted.return_to);
}

export async function googleCallback(req, res) {
  const { state, code } = req.query;
  const originalState = req.session.get("oauth_state");
  const decrypted = JSON.parse(decrypt(state));

  if (originalState !== state) {
    req.flash("err", new AuthenticationError("Oauth state does not match"));
    return res.redirect(decrypted.came_from);
  }

  const tokenData = await GoogleService.getAccessToken({ code });
  const user = await GoogleService.getUser(tokenData);

  const existing = await UserService.getByEmail(user.email);

  if (existing) {
    const [session, err] = await option(
      SessionService.createOne()({
        user_id: existing.id,
        provider_name: "google",
        user_agent: req.headers["user-agent"],
      })
    );

    if (err) {
      req.flash("err", err);
      return res.redirect(decrypted.came_from);
    }

    req.session.set("sid", session.id);
    return res.redirect(decrypted.return_to);
  }

  const [result, err] = await option(
    AuthService.signup({
      email: user.email,
      provider_name: "google",
      user_agent: req.headers["user-agent"],
      name: user.name || user.given_name,
    })
  );

  if (err) {
    req.flash("err", err);
    return res.redirect(decrypted.came_from);
  }

  req.session.set("sid", result.session.id);
  res.redirect(decrypted.return_to);
}
