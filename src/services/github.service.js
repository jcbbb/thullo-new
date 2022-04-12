import * as AuthProviderService from "../services/auth-provider.service.js";
import config from "../config/index.js";
import fetch from "node-fetch";

const provider = await AuthProviderService.getByName("github");

export async function getAccessToken({ code }) {
  const resp = await fetch(
    `${provider.oauth_token_url}?code=${code}&client_secret=${config.github_client_secret}&client_id=${provider.client_id}`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    }
  );

  return await resp.json();
}

async function getUserEmail(token) {
  const resp = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  const emails = await resp.json();

  return emails.find((email) => email.primary)?.email;
}

export async function getUser(data) {
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${data.access_token}`,
    },
  });

  const user = await resp.json();

  if (user.email) return user;

  const email = await getUserEmail(data.access_token);

  return Object.assign(user, { email });
}
