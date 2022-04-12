export async function seed(knex) {
  await knex("auth_providers").del();
  await knex("auth_providers").insert([
    {
      type: "PASSWORD",
      title: "Thullo",
      name: "thullo",
    },
    {
      type: "OAUTH",
      scope: "user",
      title: "Github",
      name: "github",
      client_id: "91c893c4cee375421d67",
      client_secret: "11d4322569290f1595b50cb6ca5df8d1f0f73c3a",
      oauth_code_url: "https://github.com/login/oauth/authorize",
      oauth_token_url: "https://github.com/login/oauth/access_token",
      redirect_uri: "http://localhost:3000/auth/github",
      response_type: "code",
    },
    {
      type: "OAUTH",
      scope: "email profile",
      title: "Google",
      name: "google",
      client_id: "53798981278-q4t7la10f0ophf6c6cjf76lpgvmlq4j7.apps.googleusercontent.com",
      client_secret: "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",
      oauth_code_url: "https://accounts.google.com/o/oauth2/auth",
      oauth_token_url: "https://accounts.google.com/o/oauth2/token",
      redirect_uri: "http://localhost:3000/auth/google",
      response_type: "code",
    },
  ]);
}
