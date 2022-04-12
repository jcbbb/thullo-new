import * as AuthProviderService from "../services/auth-provider.service.js";
import fetch from "node-fetch";

const provider = await AuthProviderService.getByName("google");

export async function getAccessToken({ code }) {
  const resp = await fetch(
    `${provider.oauth_token_url}?code=${code}&client_id=${provider.client_id}&client_secret=${provider.client_secret}&redirect_uri=${provider.redirect_uri}&grant_type=authorization_code`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return await resp.json();
}

export async function getUser(data) {
  const resp = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${data.access_token}`
  );
  return await resp.json();
}
