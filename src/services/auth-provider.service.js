import { AuthProvider } from "../models/auth-provider.model.js";

export async function getMany() {
  const providers = await AuthProvider.query()
    .select(
      "id",
      "type",
      "name",
      "title",
      "client_id",
      "scope",
      "active",
      "oauth_code_url",
      "oauth_token_url",
      "logo_url",
      "response_type",
      "redirect_uri"
    )
    .where({ active: true });

  return providers.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});
}

export async function getByName(name) {
  return await AuthProvider.query().findOne({ name });
}
