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
      oauth_code_url: "https://github.com/login/oauth/authorize",
      oauth_token_url: "https://github.com/login/oauth/access_token",
      redirect_uri: "https://thullo.pluto.uz/auth/github",
      response_type: "code",
      logo_url: "https://s3.pluto.uz/GitHub-Mark-64px.png",
    },
    {
      type: "OAUTH",
      scope: "email profile",
      title: "Google",
      name: "google",
      client_id: "53798981278-q4t7la10f0ophf6c6cjf76lpgvmlq4j7.apps.googleusercontent.com",
      oauth_code_url: "https://accounts.google.com/o/oauth2/auth",
      oauth_token_url: "https://accounts.google.com/o/oauth2/token",
      redirect_uri: "https://thullo.pluto.uz/auth/google",
      response_type: "code",
      logo_url: "https://s3.pluto.uz/Google-Mark-64px.png",
    },
  ]);
}
