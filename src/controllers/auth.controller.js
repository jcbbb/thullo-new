import * as AuthService from "../services/auth.service.js";
import * as AuthProviderService from "../services/auth-provider.service.js";
import * as GithubService from "../services/github.service.js";
import * as UserService from "../services/user.service.js";
import * as SessionService from "../services/session.service.js";
import * as GoogleService from "../services/google.service.js";
import { encrypt, decrypt, option } from "../utils/index.js";
import { AuthenticationError } from "../utils/errors.js";
import { AttestationChallenge } from "../utils/webauthn.js";
import { normalizeBody } from "../utils/index.js";
import base64url from "base64url";

export async function createCredentials(req, res) {
  const { email } = normalizeBody(req.body);
  const provider = await AuthProviderService.getByName("webauthn");
  const attestation = AttestationChallenge.from({ provider, user: { name: email } });
  req.session.set("challenge", attestation.challenge);
  res.send(attestation);
}

export async function verifyCredentials(req, res) {
  const credential = req.body;
  const originalChallenge = req.session.get("challenge");
  const clientData = JSON.parse(base64url.decode(credential.response.clientDataJSON));
  console.log({ clientData });
  console.log({ originalChallenge });
  res.send({ status: "ok" });
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

  const [result, err] = await option(
    AuthService.login({ email, password, provider_name, user_agent })
  );

  if (err) {
    req.flash("err", err);
    return res.redirect(req.url);
  }

  req.session.set("sid", result.session.id);
  res.redirect(return_to);
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
